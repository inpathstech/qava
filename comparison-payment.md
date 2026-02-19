# Payment Page Comparison: /create vs /guest

## /create Workflow (Review.tsx)

### Structure (Top to Bottom):
1. **Security Badge**
   - Lock icon + "Guaranteed safe & secure checkout"
   - Centered, margin bottom 24px

2. **Payment Card Logos**
   - 8 logos in a row (flex-wrap)
   - Powered by Stripe + Visa, Mastercard, Amex, JCB, Discover, Diners, UnionPay
   - Each logo: 48x32px, white bg, border, rounded
   - Gap 12px, margin bottom 24px

3. **Project Name**
   - 📂 {projectName}
   - Blue text (#0F62FE), font-medium, base size
   - Margin bottom 24px

4. **Tip Value Section** (if tipValue > 0)
   - "Tip Value" (bold) | Amount (right-aligned)
   - "100% goes to your talent at completion" (gray, light, small)
   - Margin bottom 24px

5. **Listing Fee Section**
   - "Listing Fee" (bold) | Total amount (right-aligned)
   - Breakdown (gray text, small):
     - Package name | Price
     - Each add-on | Price
   - Margin bottom 24px

6. **Listing Discount** (if applied)
   - "Listing discount" (bold) | -Amount (red)
   - Margin bottom 24px

7. **Total Section**
   - "Total" (xl, bold) | Amount (xl, bold)
   - "Launch date" | "Immediate" (small, light, gray)
   - Margin bottom 16px

8. **Discount Code Checkbox**
   - Checkbox + "Discount code" label
   - Margin bottom 24px

9. **Coupon Input** (if checkbox checked)
   - Input field (145px width) + "Apply code" button (or "Remove" if applied)
   - Input has placeholder "Enter code"
   - Button: black when active, gray when disabled
   - Inline flex with gap 12px

10. **Card Element** (if total > 0)
    - Wrapped in Elements provider
    - Uses StripeCardElement component

11. **Buttons** (right-aligned)
    - Back (gray) + "Checkout 🚀" (black)
    - Margin top 24px
    - Checkout button disabled if processing or no items

12. **Aurora Education Box**
    - Logo + "1% of profits donated to Aurora Education Foundation"
    - Centered, margin top 16px, margin bottom 24px

## /guest Workflow (StripePayment.tsx) - Current

### Structure (Top to Bottom):
1. **Header**
   - "Payment" title
   - "Complete your listing purchase" subtitle

2. **Order Summary Box**
   - Gray background (#F5F5F5)
   - Shows: Listing Type, Applicant Limit, Featured items
   - Total at bottom
   - All in one gray box

3. **Coupon Code** (always visible)
   - Label + input + Apply button
   - Not checkbox-gated

4. **Card Information**
   - Label + CardElement
   - Only if total > 0

5. **Free Listing Message**
   - Green box if total = 0

6. **Buttons**
   - Back + Pay $X.XX
   - Left-aligned (flex gap-4)

## Key Differences

### Missing in /guest:
- ❌ Security badge with lock icon
- ❌ Payment card logos row
- ❌ Project name display (📂 blue text)
- ❌ Separate Tip Value section
- ❌ Structured Listing Fee breakdown
- ❌ Discount code checkbox (toggle)
- ❌ Aurora Education Foundation box
- ❌ Right-aligned buttons
- ❌ "Checkout 🚀" button text
- ❌ "Launch date: Immediate" display

### Different Structure:
- ❌ Order summary in gray box vs separate sections
- ❌ Coupon always visible vs checkbox-gated
- ❌ Different spacing throughout

## Required Changes for /guest

1. Remove gray Order Summary box
2. Add security badge
3. Add payment card logos
4. Add project name display
5. Separate Tip Value section
6. Restructure Listing Fee with breakdown
7. Add discount section (if applied)
8. Restructure Total section with launch date
9. Convert coupon to checkbox-gated
10. Update buttons to right-aligned
11. Add Aurora Education box
12. Match exact spacing (24px, 16px, 12px patterns)

