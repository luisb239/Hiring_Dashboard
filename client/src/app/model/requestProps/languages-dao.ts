export class LanguagesDao {
  languages: LanguageDao[];
}

class LanguageDao {
  language: string;
  isMandatory: boolean;
}
