import unittest
from unittest.mock import patch

import badges


class ProjectBadges(unittest.TestCase):
    def test_token_thresholds(self):
        owner = "0:" + "a" * 64
        master = badges.TOKENS["vnuk"][0]
        meta = {"metadata": {"address": badges.raw_friendly(master), "decimals": 9}}
        page = {"total": 1, "addresses": [{"owner": {"address": owner}, "balance": str(200_000 * 10**9)}]}
        with patch.object(badges, "fetch", side_effect=[meta, page, meta, page]):
            self.assertEqual(badges.holders(master, False), {})
            self.assertEqual(badges.holders(master, True), {owner: True})

    def test_position_includes_pending_withdrawals(self):
        owner = "0:" + "b" * 64
        stack = [{} for _ in range(15)]
        stack[3]["num"] = hex(100_000 * 10**9)
        stack[7]["num"] = hex(400_000 * 10**9)
        with patch.object(badges, "fetch", return_value={"success": True, "stack": stack}), \
             patch.object(badges, "decode_address", side_effect=[badges.POOL_RAW, owner]):
            self.assertEqual(badges.position("stake"), (owner, 500_000 * 10**9))

    def test_stake_sums_periods_by_owner(self):
        owner = "0:" + "c" * 64
        other = "0:" + "d" * 64
        amounts = {"a": (owner, 300_000 * 10**9), "b": (owner, 200_000 * 10**9),
                   "c": (other, 500_000 * 10**9 - 1)}
        with patch.object(badges, "discover", return_value=(set(amounts), 123)), \
             patch.object(badges, "position", side_effect=amounts.__getitem__):
            result = badges.stake({})
        self.assertEqual(result["wallets"], {owner: True})
        self.assertEqual(result["cursor"], "123")
