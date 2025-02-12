import { DefaultValueConverter } from "langium";
export class AsmValueConverter extends DefaultValueConverter {
    runConverter(rule, input, cstNode) {
        if (rule.name == "NUMBER") {
            return input.endsWith("h") ? parseInt(input.slice(0, -1), 16) : parseInt(input);
        }
        else if (rule.name == "CHARACTER") {
            return input.slice(1, -1);
        }
        else {
            return super.runConverter(rule, input, cstNode);
        }
    }
}
