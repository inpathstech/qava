# Guest Workflow Field Audit
## Form Fields vs Preview Display

### ✅ FIXED ISSUES:
1. **Tip Value** - Was being double-counted in ListingPreview thumbnail (fixed)

---

## Field Mapping Analysis

### Step 0: User Info & Listing Type
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Email | `email` | ❌ No | ❌ No | ✅ Correct |
| First Name | `firstName` | ❌ No | ❌ No | ✅ Correct |
| Last Name | `lastName` | ❌ No | ❌ No | ✅ Correct |
| Post Type | `postType` | ✅ Yes (label) | ✅ Yes (label) | ✅ Correct |

### Step 1: Listing Details Part A
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Project Type | `projectType` | ❌ No | ❌ No | ✅ Correct |
| Experience Level | `experienceLevel` | ❌ No | ❌ No | ✅ Correct |
| Project Name | `projectName` | ✅ Yes | ✅ Yes | ✅ Correct |
| Focus Area | `focusArea` | ❌ No | ✅ Yes | ✅ Correct |
| Elevator Pitch | `elevatorPitch` | ❌ No | ✅ Yes | ✅ Correct |
| Full Brief | `fullBrief` | ❌ No | ✅ Yes | ✅ Correct |

### Step 2: Location & Applicants
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Remote Level | `remoteLevel` | ❌ No (project) | ✅ Yes (job/intern) | ✅ Correct |
| Location | `location` | ❌ No | ❌ No | ⚠️ Check |
| Country | `country` | ❌ No | ❌ No | ⚠️ Check |
| State | `state` | ❌ No | ❌ No | ⚠️ Check |
| City | `city` | ❌ No | ✅ Yes | ✅ Correct |
| Primary Email | `primaryEmail` | ❌ No | ❌ No | ✅ Correct |
| Secondary Email | `secondaryEmail` | ❌ No | ❌ No | ✅ Correct |
| Ideal Applicants | `idealApplicants` | ❌ No | ✅ Yes | ⚠️ Check mapping |

### Step 3: Compensation & Specifics (Projects)
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Estimated Hours | `estimatedHours` | ❌ No | ✅ Yes (as fixedHours) | ⚠️ Mapping issue |
| Q&A Hours | `walkthroughQAHours` | ❌ No | ✅ Yes | ✅ Correct |
| Ideal Start | `idealStart` | ❌ No | ✅ Yes (as idealKickOff) | ⚠️ Mapping issue |
| AI Usage % | `aiUsagePercentage` | ❌ No | ✅ Yes | ✅ Correct |
| AI Tools | `aiToolsAllowed` | ❌ No | ✅ Yes | ✅ Correct |
| Tip Value | `tipValue` | ✅ Yes | ✅ Yes | ✅ FIXED |
| Hourly Rate | `hourlyRate` | ❌ No | ❌ No | ✅ Correct |
| Is Unpaid | `isUnpaid` | ❌ No | ✅ Yes | ✅ Correct |

### Step 3: Compensation & Specifics (Jobs/Internships)
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Currency | `currency` | ❌ No | ✅ Yes | ✅ Correct |
| Min Salary | `minSalary` | ❌ No | ✅ Yes | ✅ Correct |
| Max Salary | `maxSalary` | ❌ No | ✅ Yes | ✅ Correct |
| Salary Type | `typeOfSalary` | ❌ No | ✅ Yes | ✅ Correct |
| Application Method | `receiveCandidate` | ❌ No | ✅ Yes | ✅ Correct |
| Application URL | `applicationUrl` | ❌ No | ❌ No | ✅ Correct |
| Internship Duration Type | `internshipDurationType` | ❌ No | ❌ No | ✅ Correct |
| Internship Duration | `internshipDuration` | ❌ No | ❌ No | ✅ Correct |

### Step 4: User Information
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| Organization Name | `organizationName` | ❌ No | ❌ No | ✅ Correct |
| Full Address | `fullAddress` | ❌ No | ❌ No | ✅ Correct |
| Phone | `phone` | ❌ No | ❌ No | ✅ Correct |

### Step 5: Terms
| Field | Form Field Name | Shown in Thumbnail? | Shown in Full Preview? | Status |
|-------|----------------|---------------------|----------------------|--------|
| First Time on Qava | `firstTimeOnQava` | ❌ No | ❌ No | ✅ Correct |
| Agree Terms | `agreeTerms` | ❌ No | ❌ No | ✅ Correct |

---

## ISSUES FOUND:

### ❌ Critical: Tip Value Double-Counted
**Location:** `ListingPreview.tsx` line 21-22
**Issue:** Adding `calculatedTip + formData.tipValue`, but `tipValue` already includes the calculated amount
**Impact:** Thumbnail shows 2x the correct tip value (e.g., $350 shown as $700)
**Status:** ✅ FIXED

### ⚠️ Potential: Field Name Mapping Inconsistencies
**Location:** `ListingPreview.tsx` line 24-32
**Issue:** Form uses `estimatedHours` but ReviewProject expects `fixedHours`
**Issue:** Form uses `idealStart` but ReviewProject expects `idealKickOff`  
**Issue:** Form uses `idealApplicants` but ReviewProject expects `idealApplicents` (typo)
**Impact:** Fields are mapped correctly in ListingPreview but there's inconsistency
**Status:** ✅ Already handled with mapping in ListingPreview.tsx

---

## RECOMMENDATIONS:

1. ✅ **FIXED:** Tip Value calculation in thumbnail
2. ✅ **Already Handled:** Field name mappings are done correctly
3. ⚠️ **Future:** Consider standardizing field names across components to avoid mapping issues
4. ⚠️ **Future:** Fix typo in ReviewProject: `idealApplicents` → `idealApplicants`
