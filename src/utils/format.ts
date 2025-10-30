import * as prettier from "prettier/standalone"
import * as babelParser from "prettier/plugins/babel"
import * as estreeParser from "prettier/plugins/estree"
import * as tsParser from "prettier/plugins/typescript"

const prettierrc = {
    tabWidth: 4,
    printWidth: 120,
    proseWrap: "preserve",
    semi: false,
    singleQuote: false,
} as const

export function formatTs(code: string) {
    return prettier.format(code, {
        parser: "typescript",
        plugins: [estreeParser as any, tsParser],

        ...prettierrc,
    })
}
