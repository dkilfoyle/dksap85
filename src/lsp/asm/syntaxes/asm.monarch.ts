// Monarch syntax highlighting for the asm language.
export default {
    keywords: [
        'a','aci','adc','add','adi','ana','ani','b','c','call','cc','cm','cma','cmc','cmp','cnc','cnz','cp','cpe','cpi','cpo','cz','d','dad','db','dcr','dcx','ds','dw','e','equ','h','hlt','inr','inx','jc','jm','jmp','jnc','jnz','jp','jpe','jpo','jz','l','lda','ldax','lhld','lxi','m','mov','mvi','nop','ora','org','ori','out','pchl','pop','psw','push','ral','rar','rc','ret','rlc','rm','rnc','rnz','rp','rpe','rpo','rrc','rz','sbb','sbi','shld','sp','sta','stax','stc','sub','sui','xchg','xra','xri','xthl'
    ],
    operators: [
        ',',':'
    ],
    symbols: /,|:/,

    tokenizer: {
        initial: [
            { regex: /[_a-zA-Z][a-zA-Z0-9._]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /;[^\n\r]*/, action: {"token":"COMMENT"} },
            { regex: /[0-9][0-9a-fA-F]*[h]?/, action: {"token":"number"} },
            { regex: /'[ -~]'/, action: {"token":"CHARACTER"} },
            { regex: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/, action: {"token":"string"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /[\r\n]+/, action: {"token":"white"} },
            { regex: /[ \t]/, action: {"token":"white"} },
        ],
        comment: [
        ],
    }
};
