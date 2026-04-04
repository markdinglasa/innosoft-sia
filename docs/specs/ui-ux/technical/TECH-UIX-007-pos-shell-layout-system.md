# TECH-UIX-007 — POS Shell Layout System

## Goal

- Build role-optimized operational shells instead of one generic app layout.

## Required Shells

- AuthShell
- AdminShell
- CashierShell
- TellerShell
- SettingsShell

## Rules

- Shells must share design system, not identical layout
- Each shell must expose:
    - header zone
    - action zone
    - content zone
    - feedback zone
    - keyboard context

This is a very good architecture for your app.