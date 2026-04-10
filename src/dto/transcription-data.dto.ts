import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from "class-validator";

export enum WhisperLanguage {
    afrikaans = "af", arabic = "ar", armenian = "hy", azerbaijani = "az",
    belarusian = "be", bosnian = "bs", bulgarian = "bg", catalan = "ca", chinese = "zh",
    croatian = "hr", czech = "cs", danish = "da", dutch = "nl", english = "en",
    estonian = "et", finnish = "fi", french = "fr", galician = "gl", german = "de",
    greek = "el", hebrew = "he", hindi = "hi", hungarian = "hu", icelandic = "is",
    indonesian = "id", italian = "it", japanese = "ja", kannada = "kn", kazakh = "kk",
    korean = "ko", latvian = "lv", lithuanian = "lt", macedonian = "mk", malay = "ms",
    marathi = "mr", maori = "mi", nepali = "ne", norwegian = "no", persian = "fa",
    polish = "pl", portuguese = "pt", romanian = "ro", russian = "ru", serbian = "sr",
    slovak = "sk", slovenian = "sl", spanish = "es", swahili = "sw", swedish = "sv",
    tagalog = "tl", tamil = "ta", thai = "th", turkish = "tr", ukrainian = "uk",
    urdu = "ur", vietnamese = "vi", welsh = "cy"
}

export class TranscriptionDataDto {
    @IsOptional()
    @IsEnum(WhisperLanguage)
    lang?: WhisperLanguage

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    translate?: boolean

    @IsOptional()
    @IsString()
    initial_prompt?: string

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    vad_filter?: boolean
}