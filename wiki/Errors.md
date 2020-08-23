### E001

```
E001: Invalid source list manifest format
```

#### Causes

- Received a manifest type other than `sourceList` when that is what was needed

### E002

```
E002: Source list fetch failed
```

#### Causes

- No internet connection
- Some other failure with the `fetch(...)` call

### E003

```
E003: Source list fetch response not OK

Attempted to fetch [url]
```

#### Causes

- Can't access URL (404 error)
- Temporary server outage

### E004

```
E004: Source list doesn't have valid `sources` array
```

#### Causes

- Provided `sourceList` manifest doesn't have a `sources` entry (or isn't an array)
- Provided `sources` array is empty
- Provided `sources` array is not a list of strings

### E005

```
E005: Malformed manifest (invalid JSON)
```

#### Causes

- Provided manifest is invalid JSON (maybe was served an interstitial page, e.g. from Cloudflare)
