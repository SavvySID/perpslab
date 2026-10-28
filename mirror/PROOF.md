# Mirror live copies on Somnia Tokyo testnet

Mirror copied leader `0x5Ad3f981BC477868844F1c925a82c6C0F5a33817` into follower `0xc1408020e85E9E817e821C8bCDeB913277Fa1679` (bot `0xd862604236d4854e87C35b6269D5cdB28971C8b4`) on 2026-10-28, at auto scale (about 0.072x) with a 100 USDso cap per market.

- 23 copy orders sent, 23 succeeded on-chain, all fully filled
- Reaction time from the leader fill (Reactivity push) to the copy confirming: average 3.05 s, range 2.44-3.94 s over 21 event-triggered copies
- Two sends in the first run were rejected before reaching the chain (nonce reuse between markets). The executor now sends one transaction at a time; the second run had none.

| Time (UTC) | Market | Side | Size | Reaction | Transaction |
|---|---|---|---|---|---|
| 16:12:33 | NEAR | sell | 21.7 | 2.44 s | [`0x94ef3837…16529a`](https://explorer.testnet.somnia.network/tokyo/tx/0x94ef38376ef7fea95f6fcc464fb5f5d4db3e185aed0ea07164a7fb353316529a) |
| 16:12:29 | SOL | buy | 1.97 | re-check | [`0x7df08c0a…54253d`](https://explorer.testnet.somnia.network/tokyo/tx/0x7df08c0af36741144deee060983500fc1abc2b39bc585b24bdd734af3554253d) |
| 16:12:08 | BTC | sell | 0.00124 | 3.51 s | [`0xd4e54c0d…649667`](https://explorer.testnet.somnia.network/tokyo/tx/0xd4e54c0daf4890da9cfcba39d4c68e10dd309eb42764637f619fc86ffc649667) |
| 16:11:41 | BTC | sell | 0.00124 | 3.94 s | [`0xed8e30b8…3a2cf8`](https://explorer.testnet.somnia.network/tokyo/tx/0xed8e30b851ec44fcc264a27bae3f4a513c4e5ab4b6d5c1bcc597d187053a2cf8) |
| 16:11:00 | NEAR | buy | 21.7 | 3.35 s | [`0xdcfe5dd5…ed7e2b`](https://explorer.testnet.somnia.network/tokyo/tx/0xdcfe5dd5677c5afda5a24d82754ab3c6aa114e71dfb61280709b53b4c6ed7e2b) |
| 16:09:54 | BTC | buy | 0.00248 | 2.85 s | [`0x85798dca…8ff25a`](https://explorer.testnet.somnia.network/tokyo/tx/0x85798dca16cced4f0cf1372f5256397cebb533273cf469755abe74795f8ff25a) |
| 16:09:45 | BTC | sell | 0.00248 | 3.53 s | [`0x8fcb6bbc…171d5f`](https://explorer.testnet.somnia.network/tokyo/tx/0x8fcb6bbcc5238ad8ed9175164b3a3f864aa14e1afb88faed5fbf89d08f171d5f) |
| 16:09:35 | NEAR | sell | 26.9 | 3.12 s | [`0xf560fb55…b36155`](https://explorer.testnet.somnia.network/tokyo/tx/0xf560fb550f6ae36f5707283fb6cf5536a5ea1dcd9171eacd22dd941d92b36155) |
| 16:09:23 | BTC | buy | 0.00248 | 3.14 s | [`0xa0cdad28…547942`](https://explorer.testnet.somnia.network/tokyo/tx/0xa0cdad28647d81ed2c326e9acfb126caa96c987b0b69539347d5419b59547942) |
| 16:08:09 | NEAR | sell | 16.4 | re-check | [`0x7cd9aff8…2d23fd`](https://explorer.testnet.somnia.network/tokyo/tx/0x7cd9aff8ec79be5ba32cfc96867f3b0445abcb5b5466456308fa0944a52d23fd) |
| 16:08:08 | SOL | sell | 1.41 | 2.73 s | [`0x76a98234…5037b3`](https://explorer.testnet.somnia.network/tokyo/tx/0x76a982349ba7f15b77ba7ca3d6ac8661fa762076ef782e2d66d92c6f865037b3) |
| 16:07:54 | SOL | buy | 1.42 | 3.12 s | [`0x71de1422…b3a679`](https://explorer.testnet.somnia.network/tokyo/tx/0x71de1422e372403b7119b43e596475f570c05fdcec15d62c79d4cb9efdb3a679) |
| 16:07:02 | NEAR | buy | 6 | 2.95 s | [`0x6418cfa1…9e9a64`](https://explorer.testnet.somnia.network/tokyo/tx/0x6418cfa1ae336b1871a844c29fd172882d84808e77d590a22bd5233aa69e9a64) |
| 16:06:53 | BTC | sell | 0.00124 | 2.93 s | [`0x4badc851…7d3d8c`](https://explorer.testnet.somnia.network/tokyo/tx/0x4badc851afd74f9a73d7ca794f3729a48e02a8fcef41d9066f34487f757d3d8c) |
| 16:06:20 | NEAR | buy | 15.6 | 2.98 s | [`0x41462bf3…d8a595`](https://explorer.testnet.somnia.network/tokyo/tx/0x41462bf3b0653f7dbc331914a929738c0def691cee48a18be9ee5c3a32d8a595) |
| 16:05:32 | NEAR | sell | 5.2 | 2.84 s | [`0x28e1a015…382f93`](https://explorer.testnet.somnia.network/tokyo/tx/0x28e1a01543732233fdda6b3713ff0d527dec63f2461b3fc5579673f67f382f93) |
| 16:05:03 | NEAR | sell | 16.4 | 2.96 s | [`0x51f9fa20…0be676`](https://explorer.testnet.somnia.network/tokyo/tx/0x51f9fa208716782b426e3aa6be1b4aa372a5a2542f11d4b7079d547fc50be676) |
| 16:04:02 | NEAR | buy | 21.6 | 3.11 s | [`0x6a41ecc2…d49e06`](https://explorer.testnet.somnia.network/tokyo/tx/0x6a41ecc2e329e3f52fbac461810e68cefbe389222c8e38ef3e3abe0fe7d49e06) |
| 16:03:03 | ETH | sell | 0.012 | 3.66 s | [`0xeb40bbcb…f3890e`](https://explorer.testnet.somnia.network/tokyo/tx/0xeb40bbcb703e3fb0d5cc8101ba0614d0a14dc5db6fa9b508b8fb7c3ebdf3890e) |
| 16:03:01 | ETH | sell | 0.0309 | 2.93 s | [`0x189c7157…ce88e4`](https://explorer.testnet.somnia.network/tokyo/tx/0x189c7157b13f60024d103aa5d860399016dd35841d32df36febe5068d9ce88e4) |
| 16:02:36 | ETH | buy | 0.0428 | 2.46 s | [`0x6b643ba5…632816`](https://explorer.testnet.somnia.network/tokyo/tx/0x6b643ba5e1154e10143bb7c1e573393ecf01bffb59d5960a2434643e7f632816) |
| 16:02:28 | SOL | sell | 0.99 | 2.45 s | [`0x09b50d3c…d9bf17`](https://explorer.testnet.somnia.network/tokyo/tx/0x09b50d3cb4c3fffc166cb1cb6a02a9f8a65f0216eaaebfa6543ebacd1cd9bf17) |
| 16:02:11 | ETH | sell | 0.0428 | 3.06 s | [`0x0cf39358…8060be`](https://explorer.testnet.somnia.network/tokyo/tx/0x0cf39358c52871b0a16642611519b186b59efa06a4794f527b9b4d1ae08060be) |
