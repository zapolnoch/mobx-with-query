import { makeAutoObservable, onBecomeObserved } from "mobx";
export class WithQuery {
    constructor(method, config) {
        this.method = method;
        this.config = config;
        this.started = false;
        this.state = "pending";
        this.data = undefined;
        this.load = async (...args) => {
            var _a, _b, _c, _d, _e;
            try {
                this.started = true;
                this.isLoading = true;
                const result = await this.method(args);
                this.data = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.transform)
                    ? this.config.transform(result)
                    : result;
                this.state = "fulfilled";
                (_c = (_b = this.config) === null || _b === void 0 ? void 0 : _b.onSuccess) === null || _c === void 0 ? void 0 : _c.call(_b, result);
            }
            catch (error) {
                this.error = error;
                this.state = "rejected";
                (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.onError) === null || _e === void 0 ? void 0 : _e.call(_d);
            }
            finally {
                this.isLoading = false;
                return this.data;
            }
        };
        makeAutoObservable(this);
        this.config = { loadOnMount: true, ...this.config };
        if (this.config.loadOnMount)
            onBecomeObserved(this, "data", this.load);
    }
}
