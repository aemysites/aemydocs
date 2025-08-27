# AEMY Prompt Reference

This reference documents all prompts that AEMY recognizes and their exact syntax.

## Overview

AEMY prompts must be written precisely as documented. The bot uses pattern matching to understand your intent, so exact phrasing is crucial for many operations.

---

## Command Quick Reference

| Command | Action | Notes |
|---------|--------|-------|
| [**Analyze website**](#analyze-website) |
| `Analyze <url>` | Generates site-urls.json | Default strategy |
| `analyze the website <url>` | Alternative syntax | Also works |
| `analyze the website <url> by crawling` | Generates site-urls.json by crawling | Can take longer |
| `validate the site urls` | Validates manually edited URLs | Use after manual edits |
| [**Block inventory**](#block-inventory) |
| `Block inventory` | Creates inventory.json | Simplified syntax |
| `generate inventory` | Alternative syntax | Also works |
| `generate inventory for all site urls` | Includes all URLs | More comprehensive |
| [**Import script**](#import-script) |
| `Import script` | Generates import.js and parsers | Simplified syntax |
| `create an import script for the site` | Alternative syntax | More comprehensive |
| [**Import content**](#import-content) |
| `Import content` | Runs import process | Simplified syntax |
| `Download imported content` | Request new download link for content | When link expires |
| [**Upload content**](#upload-content) |
| `Upload content <url>` | Upload to content source (SharePoint or DA) | Simplified syntax |
| `<url> Upload and preview` | Alternative syntax | Also works |
| [**Branding**](#branding) |
| `Branding` | Global typography | Simplified syntax |
| `setup the brand (eg. fonts)` | Alternative syntax | Also works |
| [**Style block**](#style-block) |
| `Style <block and variant name>` | Style specific block | Use exact inventory name |
| `style the <block> block` | Alternative syntax | Also works |
| `style all the blocks on <origin_page_url>` | This will create issues to style all the blocks on a page | Use the source URL, not <site>.aem.page |
| [**Critique**](#critique) |
| `Criticize the block <block and variant name>` | Critiques specific block and provides style feedback | Use exact inventory name |
| `Critique for block <block and variant name>` | Alternative syntax | Also works |
| [**Validate content**](#validate-content) |
| `Validate content for block <block and variant name>` | Validates content for specific block and provides content feedback | Use exact inventory name |
| `Validate content for page <origin_page_url>` | Validates content for given page and generates content_validation.json | Use the source URL, not <site>.aem.page |
| `Validate content for all pages` | Validates content for all pages and generates content_validation.json | Uses page templates if pages are more than 5 |
| [**Utility**](#utility-prompts) |
| `Create styling issues for all blocks` | Batch issue creation | For manual work |
| `catalyze the website <url>` | Full automation | Complete workflow |

---

## Analyze website

### Primary syntax: Analyze

Discovers all pages on a website using different strategies.

#### Basic Syntax
```
Analyze [URL]
```

#### Alternative Syntax
```
analyze the website [URL]
```

#### Description
Discovers all pages on the website and generates a comprehensive URL list in `site-urls.json`.

#### Parameters
- **URL** (required) - The website to analyze

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Analysis Strategies

**Sitemaps (Default)**
```
Analyze https://example.com
```
or
```
analyze the website https://example.com
```
- Reads from sitemap.xml files
- Faster and more complete for sites with good sitemaps
- Default strategy when no method specified

**Crawling**
```
analyze the website https://example.com by crawling
```
- Follows all internal links from the homepage
- Can take longer but may find pages not in sitemaps
- Useful when sitemaps are incomplete or missing

**Child Paths Only**
```
analyze the website https://example.com/blog by crawling, and include child paths only
```
- Limits analysis to a specific section of the site
- Useful for partial migrations or focused sections
- URLs outside the path will be marked as `"status": "EXCLUDED"`

**Combined Strategy (Advanced)**
First run:
```
analyze the website https://example.com
```
Then run:
```
analyze https://example.com with strategy crawl and merge
```
- Combines both sitemaps and crawling for maximum coverage
- Takes longer but ensures most complete URL list

**Custom URL List**
```
analyze the website https://example.com and use this list of URLs:
- https://example.com
- https://example.com/about
- https://example.com/products
```
- Use when you know exactly which pages to migrate
- Bypasses automatic discovery

#### Output
Creates `/tools/importer/site-urls.json` with:
```json
{
  "originUrl": "https://www.example.com",
  "urls": [
    {
      "url": "https://www.example.com/page1",
      "source": "SITEMAPS"
    },
    {
      "url": "https://www.example.com/page2",
      "source": "CRAWL",
      "status": "EXCLUDED"
    }
  ]
}
```

#### Notes
- URLs marked with `"status": "EXCLUDED"` will be skipped in subsequent steps
- The `extractionErrors` array lists URLs that failed (404s, redirects, non-HTML)
- You can manually edit site-urls.json after generation

### validate the site urls

Validates and updates manually edited site-urls.json.

#### Syntax
```
validate the site urls
```

#### Description
Checks all URLs in site-urls.json for accessibility and updates metadata.

#### Labels Required
- `aemy-help`
- `aemy-go`

---

## Block inventory

### Primary syntax: Block inventory

Creates inventory of all unique components found on the website.

#### Syntax
```
Block inventory
```

#### Alternative Syntax
```
generate inventory
```
or
```
generate inventory for all site urls
```

#### Description
Analyzes all pages to identify unique design patterns and components.

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Prerequisites
- Completed website analysis (site-urls.json exists)

---

## Import script

### Primary syntax: Import script

Generates a custom import script based on the inventory. The import script includes a parser for every block cluster found in the inventory.

#### Syntax
```
Import script
```

#### Alternative Syntax
```
create an import script for the site
```

#### Description
Creates parsers and transformation rules for each block type.

#### Advanced Syntax
```
create an import script for the blocks columns1, cards2, accordion3
```

Re-generate specific parsers again. Requires an existing import script to have already been generated. This prompt can be added to an existing pull request or as a new issue.

```
create an import script for the block columns1 with the following feedback

only include h3 and h4 headings
```

Re-generate a single specific parser with additional feedback.

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Prerequisites
- Completed inventory generation

## Import content

### Primary syntax: Import content

Starts a job to begin importing the content from all the site URLs.

#### Basic Syntax
```
Import content
```

#### Alternative Syntax
```
start importing content for the site
```

#### Browser Options
Options can be used to control how the browser behaves during import. 
Browser options must be added to `/tools/importer/aemy.json`.

- enableJavascript (boolean): Enable JavaScript during import
- pageLoadTimeout (number): The delay in milliseconds to wait after a page loads before starting transformation
- scrollToBottom (boolean): Scroll to the bottom of the page to render lazy loaded elements

These are the default browser options that are used when no `aemy.json` is present.
```json
{
  "browserOptions": {
    "pageLoadTimeout": 30000,
    "enableJavascript": true,
    "scrollToBottom": true
  }
}
```

#### Labels Required
- `aemy-help`
- `aemy-go`

#### Prerequisites
- Completed site urls
- Completed inventory
- Completed import script
- No Content Security Policy (CSP) blocking

#### CSP Check
Some websites block imports due to Content Security Policy. Check before importing:
```bash
curl -s -I "https://example.com" | grep -i "Content-Security-Policy:" | grep -E "(default-src|script-src|connect-src).*'none'|'self'|frame-ancestors.*'none'|'self'|sandbox" > /dev/null && echo "Import is blocked due to CSP" || echo "Import is allowed"
```

If blocked by CSP, use the local AEM Importer tool instead (`aem import`).

### Download the import job content

Requests a new download link to obtain the imported content. Download links typically expire after one hour.

#### Basic Syntax
```
download the import job content
```

Finds the job id from the issue comment history and requests a new download link for that job.

#### Advanced Syntax
```
download the import job content for job id [jobId]
```

Requests a new download link for a sepcific job.

- **jobId** (required) - The import job ID from the original import completion message (e.g., `11db83a3-08de-4627-9e54-a3efb32ae0b1`)

Look for the job ID in the import completion message:

```json
{
  "id": "11db83a3-08de-4627-9e54-a3efb32ae0b1",
  "status": "COMPLETE",
  ...
}
```

#### Labels Required
- `aemy-help`

---

## Upload content

### Primary syntax: Upload content

Uploads imported content to your content source (SharePoint or DA).

#### Syntax
```
Upload content [download-url]
```

#### Alternative Syntax
```
[download-url] Upload and preview
```
or
```
Upload the content using this download url [download-url] and preview it
```

#### Parameters
- **download-url** (required) - The import result ZIP URL from import step

#### Labels Required
- `aemy-help`
- `aemy-go`

#### Prerequisites
- SharePoint/DA upload workflow installed (from AEMY Setup PR)
- Completed content import

---

## Branding

### Primary syntax: Branding

Configures typography and global styles.

#### Syntax
```
Brand fonts
```

#### Alternative Syntax
```
Please setup the brand (eg. fonts)
```

#### Description
Analyzes original site typography and creates font configurations.

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Notes
- Does not currently extract colors

## Style block

### Primary syntax: Style [block and variant name]

Styles a specific component type.

#### Syntax
```
Style block [block name (variant name)]
```

#### Alternative Syntax
```
style the [block name (variant name)] block
```

#### Parameters
- **block-name** (required) - Exact name from inventory.json including variant ID

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Block Naming Rules

**Basic Blocks**
- Use the exact `target` value from inventory.json
- Example: `"target": "Hero (hero42)"` → `style the Hero (hero42) block`

**Blocks with Variants**
```json
{
  "target": "Search (minimal, search4)",
  "key": "search4"
}
```
- ❌ `style the Search block` - Won't work with variants
- ✅ `style the block Search (minimal, search4)` - Correct full reference
- ⚠️ `style the Search (minimal) block` - May work but less precise

**Finding Block Names**
1. Open `/tools/importer/inventory.json`
2. Look for the `"blocks"` section
3. Use the exact `"target"` value

#### Examples
```
Style Hero (hero42)
```
or
```
style the Hero (hero42) block
```

```
Style Cards (cards15)
```
or
```
style the Cards (cards15) block
```

```
Style Search (minimal, search4)
```
or
```
style the Search (minimal, search4) block
```

#### With Feedback
```
style the Hero (hero42) block with this feedback:
- Make the text larger
- Ensure mobile responsiveness
- Match the original button style
```

#### Style all the blocks on a page
> **_NOTE:_** It's recommended to use the `aemy-merge` label when running this aemy command.

```
style all the blocks on https://www.wknd-trendsetters.site/fashion-insights
```

This will create Github issues to style each block on the page. Note that you must use the source URL, as opposed to the Edge Delivery Services preview (or live) URL. 

#### Troubleshooting

**Error: Block not found in content**
- Check that content has been uploaded to your content source (SharePoint or DA)
- Verify the block name matches inventory.json exactly
- Ensure the preview URL is accessible

**Styling doesn't match original**
- Provide specific feedback for iteration
- AEMY can refine existing PRs with additional instructions

---

## Critique

### Primary syntax: Criticize the block [block and variant name]

Critiques specific block and provides style feedback.

#### Syntax
```
Criticize the block [block and variant name]
```

#### Alternative Syntax
```
Critique for block [block and variant name]
```

#### Description
Analyzes and critiques specific block, providing detailed style feedback.

#### Parameters
- **block-name** (required for block critique) - Exact name from inventory.json including variant ID

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Examples

**Block Critique**
```
Criticize the block Hero (hero42)
```
or
```
Critique for block Hero (hero42)
```

---

## Validate content

### Primary syntax: Validate content for block [block and variant name]

Validates content for specific block and provides content feedback.

#### Syntax
```
Validate content for block [block and variant name]
```

#### Description
Validates content differences between original and migrated content for specific blocks or pages, providing detailed content feedback and generating content_validation.json file.

#### Parameters
- **block-name** (required for block validation) - Exact name from inventory.json including variant ID
- **origin_page_url** (required for page validation) - Use the source URL, not <site>.aem.page

#### Labels Required
- `aemy-help`
- `aemy-go` (recommended)

#### Examples

**Single Block Content Validation**
```
Validate content for block Hero (hero42)
```

**Single Page Content Validation**
```
Validate content for page https://example.com/about
```

**All Pages Content Validation**
```
Validate content for all pages
```

#### Notes
- Uses page templates if pages are more than 5
- Generates content_validation.json output file. This file contains content differences feedback for given pages.
- Use exact inventory name for block validations

---

## Utility Prompts

### Create styling issues for all blocks

Generates GitHub issues for each block type found in inventory.

#### Syntax
```
Create styling issues for all blocks
```

#### Alternative Syntax
```
Create styling issues for the Hero block and the Cards block
```

```
Create styling issues for the page https://example.com/about
```

#### Description
Creates individual issues for manual or automated styling of each component.

#### Advanced Mode
> **_NOTE:_** It's recommended to use the `aemy-merge` label when running this aemy command.

```
Create styling issues for all blocks in advanced mode
```
- Automatically starts processing with critique → style → feedback → restyle cycle
- Takes ~4x longer but produces better results

#### Labels Required
- `aemy-help`
- `aemy-go` (for advanced mode)

### catalyze the website

Runs the complete migration workflow automatically.

#### Syntax
```
catalyze the website [URL]
```

#### With Custom URLs
```
catalyze the website https://example.com and use this list of URLs:
- https://example.com/page1
- https://example.com/page2
```

#### Advanced Mode
```
catalyze the website in advanced mode [URL]
```
- Each block variant goes through critique → style → feedback → restyle cycle
- Takes ~4x longer than standard mode
- Produces higher quality styling results

#### Description
Executes all migration steps in sequence:
1. Analyze website
2. Block inventory
3. Import scripts
4. Import content
5. Upload content
6. Brand fonts
7. Style block

#### Labels Required
- `aemy-help`
- `aemy-go`
- `aemy-merge` (optional - enables automatic PR merging)

---

## Command Chaining

Some commands can be chained in a single issue:

### Example: Custom Analysis and Inventory
```
1. analyze the website https://example.com
2. generate inventory for all site urls
```

---

## Important Notes

### Flexible Command Syntax

AEMY accepts both simplified and traditional command syntax:

**Simplified Syntax** (as shown in tutorial):
- `Analyze https://example.com`
- `Block inventory`
- `Import script`
- `Import content`
- `Upload content [URL]`
- `Branding`
- `Style Hero (hero42)`

**Traditional Syntax** (also works):
- `analyze the website https://example.com`
- `generate inventory`
- `create an import script for the site`
- `start importing content for the site`
- `[URL] Upload and preview`
- `setup the brand (eg. fonts)`
- `style the Hero (hero42) block`

Both syntaxes are equally valid. The simplified syntax is often easier to remember and type.

### Case Sensitivity

- Prompts are generally case-insensitive
- URLs should maintain their original case
- Block names must match inventory.json exactly

### Timing

- Add all labels before submitting the issue
- Wait for each step to complete before starting the next
- Check for `aemy-done` or `aemy-failed` labels

### Pull Request Management

- Always check PR status before attempting to merge
- Wait for AEMY to complete work before merging (check for activity in PR)

## Related Topics

**Need help getting started?**  
→ [Tutorial](tutorial.md) - Step-by-step migration guide
