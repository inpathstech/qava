# Critical Instructions for AI Assistant

## BEFORE Any Git Operations:

### 1. ALWAYS Check for Uncommitted Changes
```bash
git status
```

**If there are uncommitted changes:**
- ⛔ STOP immediately
- 🗣️ Ask the user: "You have uncommitted changes. Should I commit them first or would you like to commit them yourself?"
- ⏸️ WAIT for user response
- ❌ NEVER proceed with operations that could overwrite files

### 2. Never Use These During Merge Conflicts:
- ❌ `git checkout --ours` 
- ❌ `git checkout --theirs`
- ❌ These commands OVERWRITE files and cause data loss

### 3. Safe Conflict Resolution:
- Stop when conflicts occur
- Show the user what's conflicting
- Ask which version to keep
- Let the user resolve manually if uncertain

### 4. Before Bulk File Updates:
1. Check `git status`
2. Ask user to commit pending work
3. Create backup: `git branch backup-YYYYMMDD`
4. Make changes carefully
5. Verify nothing was lost

## What Went Wrong (January 19, 2025):

When asked to "update navbar and footer on all HTML pages":
1. ❌ Didn't check for uncommitted changes first
2. ❌ Made changes that caused merge conflicts  
3. ❌ Used `git checkout --ours` which overwrote user's recent work
4. ❌ Lost the user's updated landing page hero section and other content

**Result:** Hours of user's work was lost and had to be recovered.

## Golden Rules:

1. **Uncommitted changes are sacred** - Always check for them
2. **When in doubt, ask** - Don't guess what to overwrite
3. **Create backups** - Before risky operations
4. **Test first** - Make changes on a branch when possible

## Remember:

The user trusted me with their work. I must protect it at all costs.
