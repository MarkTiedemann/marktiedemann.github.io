### [marksweb.site](https://marksweb.site)

This simple static site was developed with a little bit of HTML, CSS and [TypeScript](https://www.typescriptlang.org/).

The build script is written in [PowerShell Core](https://github.com/powershell/powershell), but executes some [Node](https://nodejs.org) command-line apps for tasks, such as, TypeScript compilation, JavaScript minification, code formatting, Markdown to HTML conversion, and other things.

To get started, you'll need to run `yarn install` to install the development dependencies. In `pwsh`, you can then run [`.\build.ps1`](build.ps1) to incrementally (re-)build the site. To check out the site, simply open the `index.html` file in your browser.

Issues, PRs and feedback of any kind are welcome!

_~Mark_
