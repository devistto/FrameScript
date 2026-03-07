import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum WhisperTask {
  Transcribe = "transcribe",
  Translate = "translate",
}

export enum WhisperLanguage {
  Afrikaans = "af", Arabic = "ar", Armenian = "hy", Azerbaijani = "az", Belarusian = "be", Bosnian = "bs",
  Bulgarian = "bg", Catalan = "ca", Chinese = "zh", Croatian = "hr", Czech = "cs", Danish = "da",
  Dutch = "nl", English = "en", Estonian = "et", Finnish = "fi", French = "fr", Galician = "gl", German = "de",
  Greek = "el", Hebrew = "he", Hindi = "hi", Hungarian = "hu", Icelandic = "is", Indonesian = "id", Italian = "it",
  Japanese = "ja", Kannada = "kn", Kazakh = "kk", Korean = "ko", Latvian = "lv", Lithuanian = "lt", Macedonian = "mk",
  Malay = "ms", Marathi = "mr", Maori = "mi", Nepali = "ne", Norwegian = "no", Persian = "fa", Polish = "pl",
  Portuguese = "pt", Romanian = "ro", Russian = "ru", Serbian = "sr", Slovak = "sk", Slovenian = "sl",
  Spanish = "es", Swahili = "sw", Swedish = "sv", Tagalog = "tl", Tamil = "ta", Thai = "th", Turkish = "tr",
  Ukrainian = "uk", Urdu = "ur", Vietnamese = "vi", Welsh = "cy"
}

export class WhisperOptionsDto {
  @ApiProperty({
    description: "Sets whether the generated subtitles will be translated to English during processing or not",
    enum: WhisperTask,
    default: WhisperTask.Transcribe,
  })
  @IsEnum(WhisperTask)
  task!: WhisperTask;

  @ApiProperty({
    description: "Sets audio language",
    enum: WhisperLanguage,
    default: WhisperLanguage.English
  })
  @IsEnum(WhisperLanguage)
  audio_language!: WhisperLanguage;
}