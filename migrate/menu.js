const fs = require('fs')
const glob = require('glob')
const dom = require('jsdom')
const { bindNodeCallback, zip, Observable } = require('rxjs')
const { take, filter, switchMap, flatMap, map, reduce, tap, ignoreElements } = require('rxjs/operators')

const glob$ = bindNodeCallback(glob)
const readFile$ = bindNodeCallback(fs.readFile)
const writeFile$ = bindNodeCallback(fs.writeFile)

const menuIn = '/Users/adam/neo4j/developer-resources/_templates/menu_partial.erb'
const menuOut = '/Users/adam/projects/docs/asciidoc/developer/modules/ROOT/nav.adoc'

const menu$ = readFile$(menuIn)
    .pipe(
        map(buffer => {
            const { window } = new dom.JSDOM(buffer.toString())
            const { document } = window

            return Array.from( document.querySelectorAll('.menu-list dd') )
                .map(item => {
                    return [`* ${item.innerHTML}`]
                        .concat(Array.from(item.parentNode.querySelectorAll('a'))
                            .map(a => {
                                let link = a.getAttribute('href').includes('http') || a.getAttribute('target') == '_blank'
                                    ? `link:${a.getAttribute('href')}`
                                    : `xref:${a.getAttribute('href').split('/').filter(n => n).pop()}.adoc`

                                const blank = a.getAttribute('target') == '_blank' ? '^' : ''

                                return `** ${link}[${a.innerHTML}${blank}]`
                            })
                        )
                })
        }),
        flatMap(f => f),
        reduce((accumulator, value) => accumulator + value.join('\n') + '\n\n' , ``)
    )

const writeMenu$ = menu$.pipe(
    tap(n => console.log(n, menuOut)),
    switchMap(n => writeFile$(menuOut, n))
)


writeMenu$.subscribe({
    next: next => console.log(next),
    error: error => console.log('error', error),
    complete: () => console.log('\n\n👍 complete: ', menuOut)
})

