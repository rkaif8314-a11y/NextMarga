# NextMarga Testing Notes

For API changes, test valid requests, missing fields, wrong types, oversized input, malformed JSON, and unexpected AI output. For UI changes, check loading, error, empty, mobile, and keyboard-accessible states.

Keep validation tests separate from model-output tests so request failures and AI response failures are easy to diagnose.
