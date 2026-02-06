---
name: commit
description: Commit changes following conventional commit conventions.
user-invocable: true
---

When the user requests you to commit the changes, you MUST start by stating the changes and then create a new commit in each repository following the conventional commit message convention.

```
<type>(<scope>): <title>
```

The type can be of type `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`.

The scope can be of type `cms`, `web`. If both are changed, omit the scope.
