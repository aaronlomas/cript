# Security Policy

We deeply value the security of **Cript**. If you believe you have found a security vulnerability, we appreciate you reporting it to us in a responsible manner.

## Supported Versions

Currently, we only provide security patches for the most recent stable versions of each component.


| Component | Supported Version | Status |
| :--- | :--- | :--- |
| **Cript** (Application) | `1.x.x` | ✅ Supported |
| **Cript** (Application) | `< 1.0.0` | ❌ Not supported |
| **Criptor** (Engine SDK) | `1.x.x` | ✅ Supported |
| **Criptor** (Engine SDK) | `< 1.0.0` | ❌ Not supported |

For technical details on our cryptographic implementation and memory hardening measures, please consult the [Security White Paper](https://github.com/aaronlomas/criptor/blob/main/docs/SECURITY_WHITE_PAPER.md).

## Reporting a Vulnerability

**Please DO NOT open a public Issue to report a vulnerability.**

To report a security flaw privately and securely, please use the **GitHub Private Security Advisory** feature:

1. Go to the [Security](https://github.com/aaronlomas/cript/security/advisories/new) tab of this repository.
2. Click on **"Report a vulnerability"**.
3. Include a detailed description of the flaw, steps to reproduce it, and, if possible, a Proof of Concept (PoC).

This method allows the maintenance team to investigate and fix the problem privately before a public Security Advisory is released.

We promise to:
- Acknowledge receipt of your report within 48-72 hours.
- Keep you informed about the progress of the patch.
- Give you proper credit in our release notes (if you wish) once the issue is resolved.

## Response Philosophy
Cript takes digital sovereignty seriously. Any flaw that compromises the isolation of secrets or the integrity of encryption will be treated with the highest priority.

Thank you for helping us keep Cript secure.

