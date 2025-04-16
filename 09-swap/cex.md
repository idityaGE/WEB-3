# Centralized Exchanges (CEXs)

A centralized exchange (CEX) is a platform where users can trade cryptocurrencies through a third-party intermediary that facilitates transactions. Examples include Binance, Coinbase, and Kraken. Unlike decentralized exchanges (DEXs), CEXs maintain custody of user funds and operate with a central authority.

## Key Components

### Orderbook

An orderbook is a list of all buy and sell orders for a specific asset, organized by price level. It shows:

- **Buy orders (bids)**: Orders to purchase an asset at a specified price
- **Sell orders (asks)**: Orders to sell an asset at a specified price

**Example**: 
```
BTC/USDT Orderbook
-------------------
Sell Orders (Asks)
$62,150 - 0.5 BTC
$62,100 - 0.8 BTC
$62,050 - 1.2 BTC

Buy Orders (Bids)
$62,000 - 1.5 BTC
$61,950 - 2.0 BTC
$61,900 - 1.3 BTC
```

The orderbook matches buyers with sellers based on price and time priority.

### Spread

The spread is the difference between the lowest ask price and the highest bid price in the orderbook. It represents the transaction cost for immediate execution.

**Example**:
- Lowest ask (sell order): $62,050
- Highest bid (buy order): $62,000
- Spread: $50 (or about 0.08%)

A narrow spread indicates a liquid market, while a wide spread suggests less liquidity.

### Liquidity

Liquidity refers to how easily an asset can be bought or sold without significantly affecting its price. High liquidity means:

- Large order volumes
- Tight spreads
- Minimal price slippage

**Example**: Bitcoin trading pairs on major exchanges like Binance have high liquidity, allowing traders to execute large orders with minimal price impact. In contrast, a newly listed token might have low liquidity, causing significant price movement with relatively small trades.

### Market Maker

Market makers are professional traders or institutions that provide liquidity by continuously offering to buy and sell assets. They:

- Place limit orders on both sides of the orderbook
- Profit from the spread between buy and sell prices
- Reduce price volatility by ensuring there's always a counterparty

**Example**: A market maker might simultaneously place:
- Buy orders for BTC at $61,950, $61,975, and $62,000
- Sell orders for BTC at $62,050, $62,075, and $62,100

Market makers earn the spread as compensation for providing liquidity and taking on inventory risk.

CEXs often incentivize market makers with reduced fees or rebates to ensure their platforms remain liquid and competitive.
