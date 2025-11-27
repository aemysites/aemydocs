# AEMY - The AI Assistant

AEMY is an AI-powered GitHub assistant that automates the website migration process for Experience Catalyst.

## Overview

AEMY (AEM + AI) is a GitHub bot that responds to issues and pull requests in your repository. It can analyze websites, generate import scripts, style blocks, and manage the entire migration workflow. AEMY acts like a team member, creating branches, committing code, and opening pull requests for your review.

## How AEMY Works

1. **Issue-Driven**: You communicate with AEMY by creating GitHub issues
2. **Label-Triggered**: Specific labels activate AEMY and control its behavior
3. **Branch-Based**: AEMY creates feature branches for each task
4. **PR-Focused**: Changes are submitted as pull requests for review
5. **Conversational**: You can provide feedback and iterate on results

## Key Features

- **Website Analysis**: Crawls and catalogs all pages ([analyze command](aemy-prompts.md#analyze-website))
- **Block Detection**: Identifies unique design patterns ([inventory command](aemy-prompts.md#block-inventory))
- **Code Generation**: Creates import scripts and parsers ([import script command](aemy-prompts.md#import-scripts))
- **Style Matching**: Generates CSS to match original designs ([styling commands](aemy-prompts.md#style-block))

## Labels System

AEMY uses GitHub labels to understand your intent:

### Core Labels

- **`aemy-help`**: Activates AEMY on an issue (always required)
- **`aemy-go`**: Allows AEMY to execute without confirmation (requires also using `aemy-help`)
- **`aemy-merge`**: Permits automatic PR merging (enables auto-merge after PR creation)

### Status Labels

- **`aemy-running`**: AEMY is currently working
- **`aemy-done`**: Task completed successfully
- **`aemy-failed`**: Task encountered an error

## Communication Patterns

### Basic Interaction
```
1. Create issue with description
2. Add `aemy-help` label
3. AEMY presents a plan
4. You respond with "/go" to proceed
5. AEMY executes and creates PR
```

### Automated Execution
```
1. Create issue with description
2. Add `aemy-help` and `aemy-go` labels together
3. AEMY presents plan and executes it immediately
4. Review generated PR
```

## Task Management

AEMY can handle complex workflows by creating sub-issues:

1. **Individual Issues**: Each task is a separate issue
2. **Sequential Execution**: Complete one task before starting the next
3. **Manual Progression**: You control when to start each step
4. **Error Handling**: Reports failures with detailed messages

## Best Practices

### Writing Issues for AEMY

1. **Be Specific**: Use exact URLs and block names
2. **Use Keywords**: AEMY recognizes specific command phrases
3. **One Task Per Issue**: Keep issues focused

### Label Management

1. **Add All Labels Together**: Before creating the issue
2. **Don't Remove Labels**: AEMY uses them to track state
3. **Check Status Labels**: To understand current progress

### Working with PRs

1. **Review Changes**: Always examine generated code
2. **Test Locally**: Pull branch and verify functionality
3. **Provide Feedback**: AEMY can iterate on existing PRs
4. **Merge When Ready**: You control when changes go live

### Migration Process

1. **Start Simple**: Test with a few pages first
2. **Verify Each Stage**: Check outputs before proceeding
3. **Document Issues**: Create clear issues for problems
4. **Iterate on Styling**: Give AEMY feedback to get improvements
5. **Test Thoroughly**: Check all breakpoints and interactions

## Success Indicators

### Technical Metrics
- All pages accessible at preview URL
- No 404 errors in browser console
- Images loading from Edge Delivery CDN
- Core Web Vitals scores improved

### Visual Fidelity
- Layout matches original
- Typography consistent
- Colors and spacing preserved
- Interactive elements functional

### Content Integrity
- All text content preserved
- Links updated correctly
- Metadata migrated
- Navigation structure maintained

## Related Topics

- [AEMY Prompt Reference](aemy-prompts.md)
