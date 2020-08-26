### E001

```
E001: Invalid manifest format
```

#### Causes

- Received a manifest type which doesn't match what was expected

### E002

```
E002: Manifest fetch failed

Attempted to fetch URL <url>
```

#### Causes

- No internet connection
- Some other failure with the `fetch(...)` call

### E003

```
E003: Manifest fetch response not OK

Attempted to fetch <url>
```

#### Causes

- Can't access URL (404 error)
- Temporary server outage

### E004

```
E004: Malformed manifest (invalid JSON)
```

#### Causes

- Provided manifest is invalid JSON (maybe was served an interstitial page, e.g. from Cloudflare)

### E005

```
E005: Invalid path <cfg/json path>
```

#### Causes

- Path to a CFG/JSON file has not been set
- Path to CFG/JSON file doesn't match the regex (X:\...\*.cfg)/(X:\...\*.JSON)

### E006

```
E006: Missing JSON Data <value missing>
```

#### Causes

- A JSON object is missing values.
