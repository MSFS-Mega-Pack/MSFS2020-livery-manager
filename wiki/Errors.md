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

### E007

```
E007: CFG File path undefined
```

#### Causes

- Path to a CFG File has not been set
