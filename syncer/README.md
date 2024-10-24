# NewsCrawler

NewsCrawler

# Running the Crawler

## Sync news

Windows

```bash
./ncrawler.exe sync
```

Mac

```bash
./ncrawler sync
```

## Print Categories

Windows

```bash
./ncrawler.exe categories
```

Mac

```bash
./ncrawler categories
```

## Export News

Windows

```bash
./ncrawler.exe export category="bangladesh" limit=20
```

```bash
./ncrawler.exe export -c="bangladesh" -l=20
```

Mac

```bash
./ncrawler export category="bangladesh" limit=20
```

```bash
./ncrawler export -c="bangladesh" -l=20
```

To run the crawler, use the following command:

```bash
make run
```

# DB Migrations

run (if not installed)

```
go install -tags 'sqlite3' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

To create a new migration

```
migrate create -ext sql -dir database/migrations -seq name_for_migration
```

and then edit the new files in `/db/migrations`.

### Migrations Up

```
make migrate-up
```

### Migrations Down

```
make migrate-down
```
