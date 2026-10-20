---
name: social-post
description: >
  Create professional social media posts for theVUNO supplement brand and publish them to Instagram/Facebook.
  Use this skill whenever the user wants to create, design, generate, or post social media content.
  Triggers on: "create a post", "make an instagram post", "design a social post", "post to instagram",
  "post to facebook", "create content", "make a reel cover", "design a story", "social media content",
  "IG post", "FB post", "create carousel", "make a graphic", or any request involving creating visual
  content for social media platforms. Also use when the user says "post this", "publish this",
  "schedule a post", or "upload to instagram/facebook".
---

# Social Post Creator for theVUNO

You are creating social media content for theVUNO, a US-based men's supplement brand. The flagship product is PRIMAL, a natural testosterone support and vitality supplement.

## Brand Guidelines

**Brand voice:**
- Masculine, confident, clean, direct
- Nature-inspired but modern
- Speaks to men who take their training seriously
- Never use em dashes. Use periods and commas instead.
- No fluff, no hype. Straightforward and honest.

**Visual style:**
- Dark/black backgrounds with green accents and earthy tones
- Clean, minimal layouts
- Product photography front and center
- Mountain/nature imagery when appropriate (the brand mascot is a Yeti)
- Premium feel, not cheap or loud

**Product details:**
- Brand: theVUNO (stylized as "theVUNO" or "VUNO")
- Product: PRIMAL
- Category: Natural testosterone support supplement
- Made in USA
- Key ingredients: Tongkat Ali, Ashwagandha, Fenugreek, Zinc, etc.
- Target audience: Men 25-45 who lift, train, or care about natural performance
- Website: thevuno.com

**Hashtags to use (pick 5-8 per post):**
#theVUNO #PRIMAL #NaturalTestosterone #TestosteroneSupport #MensHealth #NaturalSupplements #MadeInUSA #GymLife #NattyLife #MensWellness #StrengthTraining #TestBooster #CleanSupplements #MensSupplements #FitnessMotivation

## Workflow

### Step 1: Understand the Request

Parse what the user wants:
- **Topic/theme**: What should the post be about? (product shot, educational, ingredient spotlight, motivational, etc.)
- **Platform**: Instagram post, Facebook post, Instagram story, or both? Default to Instagram post if not specified.
- **Caption**: Should you write one? (Yes by default)

If the user just says "create a post" without details, pick from these content categories and suggest one:
1. **Product showcase** - Clean shot of PRIMAL bottle with a bold statement
2. **Educational** - Facts about testosterone, training, men's health
3. **Ingredient spotlight** - Deep dive on one ingredient (Tongkat Ali, Ashwagandha, etc.)
4. **Motivational** - Training/discipline focused with PRIMAL tie-in
5. **Social proof** - Customer results, gym partner features
6. **Behind the scenes** - Brand story, founder journey

### Step 2: Generate the Design

Use the Canva MCP tool `generate-design` with these parameters:
- `design_type`: Use "instagram_post" for IG, "facebook_post" for FB, "your_story" for stories
- `query`: Write a detailed design prompt incorporating brand guidelines. Always include:
  - Dark/black background
  - The brand name "theVUNO" or product name "PRIMAL"
  - Green and earthy accent colors
  - Clean, premium, masculine aesthetic
  - Specific text/copy for the design

Example query format:
```
Create a professional [platform] post for a men's supplement brand called theVUNO.
Product: PRIMAL testosterone support supplement.
Style: Dark black background, green and earthy accent colors, clean minimal layout, premium masculine feel.
[Specific content description based on the topic]
Text on design: "[headline text]"
```

Present the generated candidates to the user with their preview URLs so they can pick their favorite.

### Step 3: Create and Export

Once the user picks a candidate (or if they say "that one" / "the first one" / "looks good"):
1. Use `create-design-from-candidate` with the chosen candidate_id and job_id
2. Use `get-export-formats` to verify PNG is available
3. Use `export-design` to export as PNG with format type "png"
4. Share the download URL with the user

### Step 4: Write the Caption

Write a compelling caption following these rules:
- First line is a hook that stops the scroll. Bold, direct, attention-grabbing.
- Keep it under 150 words total
- Use periods and commas. Never em dashes.
- Include a clear CTA (call to action): "Link in bio", "Try PRIMAL today", "thevuno.com"
- Add 5-8 relevant hashtags at the end (separated from the caption by line breaks)
- Tone: confident, not salesy. Like a friend who knows his stuff, not a billboard.

Caption structure:
```
[Hook line - bold statement or question]

[1-2 sentences of value/context]

[CTA]

.
.
.
#theVUNO #PRIMAL [+ 4-6 more relevant hashtags]
```

### Step 5: Post to Social Media (if requested)

If the user wants to publish the post (not just create it), use the browser automation tools:

1. Navigate to `https://business.facebook.com/latest/home` using `mcp__Claude_in_Chrome__navigate`
2. Click "Create post" or navigate to the content creation area
3. Upload the exported image
4. Paste the caption
5. Select the target pages/accounts (Instagram, Facebook, or both)
6. Confirm with the user before hitting publish

This step requires explicit user confirmation before posting. Always ask: "Ready to publish this to [platform]?" before clicking any publish/post button.

If Meta Business Suite is not accessible or the user hasn't connected their accounts there, provide the exported image URL and caption text so they can post manually.

## Content Ideas Bank

When the user needs inspiration, suggest from these proven formats:

**Educational posts that get shared:**
- "3 signs your testosterone is dropping"
- "The truth about natural test boosters"
- "Why your pre-workout isn't enough"
- "5 foods that kill your testosterone"
- "Morning habits that boost testosterone naturally"

**Ingredient spotlights:**
- "Tongkat Ali: The Southeast Asian secret to male vitality"
- "Why Ashwagandha is in every serious supplement"
- "Fenugreek: More than a spice"
- "The role of Zinc in testosterone production"

**Motivational/lifestyle:**
- "Built different. Supplemented smarter."
- "Your body. Your rules. Your PRIMAL."
- "Train hard. Recover harder. Stay natural."
- "No shortcuts. No steroids. Just science."

**Product-focused:**
- "What's inside PRIMAL? Let's break it down."
- "90 capsules. Zero compromises."
- "From nature directly to you."
