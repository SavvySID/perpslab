import { readFileSync } from "node:fs"
import { createServer } from "node:http"
import { formatUnits, type Address } from "viem"
import type { Config } from "./config.js"
import type { State } from "./state.js"
import { APP_URL, EXPLORER_URL } from "./venue.js"

// USDso, the perps collateral, has 18 decimals.
const usd = (raw: bigint) => formatUnits(raw, 18)

function snapshot(cfg: Config, state: State, bot: Address) {
  const live = state.actions.filter((a) => !a.dryRun)
  const timed = live.filter((a) => a.reactionMs !== undefined)
  return {
    network: "Somnia Tokyo testnet (chain 50383)",
    explorer: EXPLORER_URL,
    app: APP_URL,
    leader: cfg.leader,
    follower: cfg.follower,
    bot,
    dryRun: cfg.dryRun,
    scale: state.ratioText,
    copyExisting: cfg.copyExisting,
    maxNotionalUsdso: String(cfg.maxNotionalUsdso),
    startedAt: state.startedAt,
    equity: { leader: usd(state.equity.leader), follower: usd(state.equity.follower) },
    stats: {
      events: state.events,
      lastEventAt: state.lastEventAt || null,
      orders: live.filter((a) => a.hash).length,
      copied: live.filter((a) => a.ok && a.filled && Number(a.filled) > 0).length,
      failures: live.filter((a) => !a.ok).length,
      avgReactionMs: timed.length ? Math.round(timed.reduce((s, a) => s + a.reactionMs!, 0) / timed.length) : null,
    },
    markets: [...state.books.values()].map((b) => ({
      symbol: b.symbol,
      leader: formatUnits(b.leader, b.baseDecimals),
      target: formatUnits(b.target, b.baseDecimals),
      follower: formatUnits(b.follower, b.baseDecimals),
      mark: b.mark === null ? null : formatUnits(b.mark, b.quoteDecimals),
      status: b.status,
    })),
    actions: state.actions.slice(0, 50),
  }
}

export function startDashboard(cfg: Config, state: State, bot: Address) {
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8")
  createServer((req, res) => {
    if (req.url?.startsWith("/api/state")) {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(snapshot(cfg, state, bot)))
      return
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" })
    res.end(html)
  }).listen(cfg.port, "127.0.0.1", () => console.log(`Dashboard: http://localhost:${cfg.port}`))
}
