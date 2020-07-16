export class ConfigProfile {
    constructor(
        public userId: number,
        public profileName: string,
        public configs: any = {}) { }
}
