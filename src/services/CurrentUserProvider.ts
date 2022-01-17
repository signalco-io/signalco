import { User } from "@auth0/auth0-spa-js";
import LocalStorageService from "./LocalStorageService";

class CurrentUserProvider {
    getCurrentUser() {
        return LocalStorageService.getItem<User>('user');
    }

    setCurrentUser(user: User) {
        LocalStorageService.setItem('user', user);
    }

    isLoggedIn() {
        return typeof this.getToken() !== 'undefined';
    }

    getToken() {
        return LocalStorageService.getItem<string>('signalauth0keycache');
    }

    setToken(token: string | undefined) {
        LocalStorageService.setItem('signalauth0keycache', token);
    }
}

const provider = new CurrentUserProvider();

export default provider;