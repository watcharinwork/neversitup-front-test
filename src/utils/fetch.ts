type MethodType = "GET" | "POST" | "PUT" | "DELETE";


class HttpFetch {
    private urlEndpoint: string = "https://candidate.neversitup.com/todo"

    private headers = new Headers()

    constructor() {
        this.headers.append("Content-Type", "application/json")
        let token = localStorage.getItem("td_token");
        if (token)
            this.headers.append("Authorization", "Bearer " + token);;
    }



    async login(data: { username: string, password: string }) {

        return await fetch(this.urlEndpoint + "/users/auth", {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return Promise.reject(response.statusText);
            }
        }).then((result: any) => {
            localStorage.setItem("td_token", result.token)
            this.headers.append("Authorization", "Bearer " + result.token);
            return Promise.resolve(true)
        }).catch(error => {
            return Promise.reject(error);
        })

    }

    clearToken() {
        this.headers.delete("Authorization");
        localStorage.removeItem("td_token");
    }



    async callFetch(url: string, method: MethodType, data?: any) {

        if (this.headers.get("Authorization") === null) {
            return Promise.reject("Please Login first!");
        }


        return fetch(this.urlEndpoint + url, {
            method: method,
            headers: this.headers,
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                return Promise.resolve(response.json());
            }
            else {
                return Promise.reject(response.statusText);
            }
        }).catch(error => {
            return Promise.reject(error);
        })
    }

}

export default new HttpFetch();