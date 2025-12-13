# Revenue Model – v1

## Overview
The EnergyEcosystem platform uses a simple token-gated access model.

## Rule
A wallet must hold a minimum amount of ELCoin (ELC) to access platform services.

## Parameters
- Token: ELC (SPL)
- Network: Solana Devnet
- Required balance: 1,000 ELC

## Flow
1. User connects wallet
2. Platform checks ELC balance
3. If balance >= required amount → access granted
4. If not → access denied

## Monetization
- Users acquire ELC through distribution or secondary markets
- Platform does not custody user funds
- Token utility drives demand
