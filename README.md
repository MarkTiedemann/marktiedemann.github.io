### [marksweb.site](https://marksweb.site)

This simple static site was developed with a little bit of HTML, CSS and [TypeScript](https://www.typescriptlang.org/), and the cross-platform [PowerShell Core](https://github.com/powershell/powershell) for some minimal build scripts (there's no fancy webpack configuration here... _bummer, I know!_).

The PowerShell scripts execute some [Node.js](https://nodejs.org) CLI apps for tasks, such as, TypeScript compilation, JavaScript minification, code formatting, Markdown to HTML conversion, and other things.

To get started, you'll need to run `npm install` or `yarn install` to install the development dependencies. With `pwsh`, you can then run [`.\build.ps1`](build.ps1) to build the site and [`.\serve.ps1`](serve.ps1) to start a server and open the site in your browser.

Issues, PRs and feedback of any kind are welcome!

_~Mark_
