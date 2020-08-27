import gettextParser, { GetTextTranslations } from 'gettext-parser';
import fs from 'fs-extra';

export class PoParser implements PoParserModel {
    public parse(filePath: string): TrimmedGetTextTranslations {
        const input = fs.readFileSync(filePath);
        const parsed = gettextParser.po.parse(input);
        const trimmedParsed = this.trim(parsed);
        return trimmedParsed;
    }

    private trim(translation: GetTextTranslations): TrimmedGetTextTranslations {
        const trimmed = {} as TrimmedGetTextTranslations;
        for (const context of Object.keys(translation.translations)) {
            const contextMessages = {} as TrimmedGetTextTranslationsMessage;
            for (const msgID in translation.translations[context]) {
                if (msgID && translation.translations[context][msgID].msgstr) {
                    contextMessages[msgID] = translation.translations[context][msgID].msgstr;
                }
            }
            trimmed[context] = contextMessages;
        }
        return trimmed;
    }
}
export interface PoParserModel {
    parse(filePath: string): TrimmedGetTextTranslations;
}

export interface TrimmedGetTextTranslations {
    [context: string]: TrimmedGetTextTranslationsMessage;
}

export interface TrimmedGetTextTranslationsMessage {
    [msgid: string]: string[];
}
