# TTRADER Application: User Guide

Welcome to TTRADER, your powerful and streamlined interface for trading on the Deriv platform. This guide will walk you through everything you need to know to get started, from connecting your account to placing your first trade.

## 1. Getting Started: Connecting Your Account

To use TTRADER, you need to connect it to your Deriv account using an API token.

#### **Step 1: Get Your Deriv API Token**

An API token is a secure key that allows TTRADER to access your Deriv account for trading purposes.

1.  Log in to your Deriv account and navigate to the API token section: [Deriv API Token Management](https://app.deriv.com/account/api-token).
2.  Click "Create new token".
3.  Give your token a name (e.g., "TTRADER_App").
4.  Ensure you give the token **"Read"** and **"Trade"** permissions.
5.  Click "Create" and copy the generated token. Keep it safe!

#### **Step 2: Connect to TTRADER**

On the TTRADER launch screen, you'll see a login window.
1.  Paste your newly created API token into the input field.
2.  Click the **"Connect"** button.

#### **Don't have a Deriv account?**

Click the **"Create a Deriv Account"** button. This will take you to the official Deriv sign-up page. Creating an account through this link helps support the TTRADER platform via the official affiliate program, at no extra cost to you.

## 2. Understanding the Trading Interface

The TTRADER interface is designed to be clean and intuitive. Here’s a breakdown of the main components.

#### **The Header (Top Bar)**

*   **Status Indicator**: A colored circle next to your balance shows your connection status:
    *   **Green**: Connected and ready to trade.
    *   **Yellow**: Connecting...
    *   **Grey**: Disconnected.
    *   **Red**: Connection error.
*   **Balance**: Your real-time account balance and currency.
*   **Deposit / Withdraw**: Securely manage your funds (see Section 4).
*   **Symbol Selector**: A dropdown menu to choose which asset you want to trade (e.g., Volatility 100 Index, EUR/USD).
*   **Timeframe Buttons**: Select the time interval for each candle on the chart (e.g., `1m` for 1 minute, `1h` for 1 hour).
*   **Disconnect**: Safely log out of the application.

#### **The Chart**

This is a real-time candlestick chart showing the price movement of your selected symbol. Each "candle" represents the open, high, low, and close price for the selected timeframe.

#### **The Open Positions Table**

Located below the chart (on desktop) or in the side panel (on mobile), this table displays all your currently active trades. You can monitor their type, stake, and real-time profit or loss.

## 3. How to Place a Trade

The **Trade Panel** on the right is your command center for executing trades.

#### **Common Settings**

*   **Stake Amount**: The amount of money (in USD) you wish to risk on a single trade.

#### **Trade Types (Tabs)**

TTRADER supports several contract types, each with a unique strategy.

*   **Rise / Fall**: The most basic trade.
    *   **To Place**: Set your stake and duration in **ticks**.
    *   Click **"Rise"** if you predict the price will be higher than the entry spot when the contract expires.
    *   Click **"Fall"** if you predict it will be lower.

*   **Touch / No Touch**: Predict whether the price will hit a specific barrier.
    *   **To Place**: Set the **Barrier Offset** (the distance from the current price).
    *   Click **"Touch"** if you predict the price will touch the barrier at least once before the contract expires.
    *   Click **"No Touch"** if you predict it will not.

*   **In / Out** (Ends Between / Ends Outside):
    *   **To Place**: Set a **Low Barrier** and a **High Barrier** offset to create a price range.
    *   Click **"Ends Between"** if you predict the price will be *within* the barrier range at expiry.
    *   Click **"Ends Outside"** if you predict the price will be *outside* the barrier range at expiry.

*   **Matches / Differs**: Predict the last digit of the asset's price.
    *   **To Place**: Set your **Last Digit Prediction** (a number from 0 to 9).
    *   Click **"Matches"** if you predict the last digit of the price will match your prediction at expiry.
    *   Click **"Differs"** if you predict it will not match.

*   **Long Term**: Similar to Rise/Fall, but for longer timeframes.
    *   **To Place**: Instead of ticks, set the **Duration** and choose the **Unit** (Minutes, Hours, or Days). Then click **"Rise"** or **"Fall"**.

## 4. Managing Your Funds

You can easily add or withdraw funds from your Deriv account.

*   Click the **"Deposit"** or **"Withdraw"** button in the header.
*   You will be redirected to the **official and secure Deriv cashier page** in a new browser tab.
*   **Security Note**: TTRADER never handles your financial transactions or payment information directly. This process ensures your funds are always managed with the highest security on Deriv's platform.

## 5. TTRADER's Revenue Model (Transparency First)

We believe in being completely transparent about how our application is funded. TTRADER earns revenue in two ways:

1.  **Trade Commission (3%)**: A 3% commission is applied to the stake of every trade you place. For example, if you place a trade with a $10 stake, the total cost will be $10.30, and the $0.30 commission is earned by TTRADER. This fee supports the ongoing development, maintenance, and hosting of the application. The fee is processed securely by Deriv and credited to our partner account.

2.  **Affiliate Program**: When new users sign up for Deriv using the **"Create a Deriv Account"** link on our login page, we earn a referral commission from Deriv based on their trading activity. This comes at **no extra cost** to the user and does not affect their spreads or trading conditions.

## 6. Frequently Asked Questions (FAQ)

*   **Is my money safe with TTRADER?**
    *   Yes. Your funds and personal information are held securely with Deriv. TTRADER is simply an interface that communicates with the Deriv API and never has direct access to your capital or sensitive data.

*   **Where do my commission earnings go?**
    *   The 3% commission from your trades is automatically processed by Deriv's system and credited to the TTRADER partner account. This is how we fund the app.

*   **Why was my trade rejected or why can't I place a trade?**
    *   Please check the following:
        1.  Your connection status indicator is green.
        2.  You have sufficient funds in your balance for the stake amount plus the 3% commission.
        3.  The market for the symbol you selected is currently open for trading.
        4.  The app does not display a specific error message.

---
Thank you for using TTRADER! We wish you the best in your trading journey.
