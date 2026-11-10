import unittest
from unittest.mock import patch

import domains


class DomainChecks(unittest.TestCase):
    def test_recent_trader_is_not_buried_behind_unchecked_history(self):
        wallets = [f"old-{i}" for i in range(1700)] + ["recent"]
        records = {w: {"digitsAt": 0} for w in wallets}
        records["recent"] = {"digitsAt": 1, "lastAttempt": 1}
        queue = domains.check_queue(wallets, {"recent"}, records, 200000)
        self.assertEqual(queue[0], "recent")
        self.assertEqual(len(queue), 45)

    def test_history_keeps_a_share_when_visible_queue_is_full(self):
        wallets = [f"visible-{i}" for i in range(100)] + [f"old-{i}" for i in range(100)]
        visible = set(wallets[:100])
        queue = domains.check_queue(wallets, visible, {w: {} for w in wallets}, 200000)
        self.assertEqual(sum(w in visible for w in queue), 30)
        self.assertEqual(len(set(queue)), 45)

    def test_hourly_visible_cache_daily_history_and_failed_retry(self):
        now = 200000
        records = {
            "visible-due": {"digitsAt": now - 3600},
            "visible-fresh": {"digitsAt": now - 3599},
            "history-fresh": {"digitsAt": now - 3600},
            "history-due": {"digitsAt": now - 86400},
            "failed": {"digitsAt": 0, "lastAttempt": now - 1799},
        }
        visible = {"visible-due", "visible-fresh", "failed"}
        self.assertEqual(domains.check_queue(list(records), visible, records, now),
                         ["visible-due", "history-due"])

    def test_only_verified_four_digit_domains_owned_by_wallet_are_accepted(self):
        wallet, other = "0:" + "a" * 64, "0:" + "b" * 64
        good = {"owner": {"address": wallet}, "collection": {"address": domains.ROOT},
                "verified": True, "dns": "1613.ton"}
        items = [good, {**good, "verified": False},
                 {**good, "dns": "1234.ton", "owner": {"address": other}},
                 {**good, "dns": "1613.socool.ton"},
                 {**good, "dns": "9999.ton", "collection": {"address": domains.SOCOOL}}]
        with patch.object(domains, "pages", return_value=items):
            self.assertEqual(domains.four_digits(wallet), ["1613.ton"])

    def test_empty_success_removes_transferred_domain(self):
        snapshot = {"trades": {"rows": [{"wallet": "wallet"}]},
                    "domains": {"byWallet": {"wallet": {"digits": ["1613.ton"], "digitsAt": 1}}}}
        with patch.object(domains, "subdomains", return_value={}), \
                patch.object(domains, "four_digits", return_value=[]), \
                patch.object(domains.time, "sleep"):
            result = domains.enrich(snapshot, 200000)
        self.assertEqual(result["byWallet"]["wallet"]["digits"], [])
        self.assertEqual(result["byWallet"]["wallet"]["digitsAt"], 200000)


if __name__ == "__main__":
    unittest.main()
