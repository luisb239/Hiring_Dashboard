export class ConfigProfileDao {
  constructor(
    public userId: number,
    public profileName: string,
    public configs: any = {}) {
  }
}
