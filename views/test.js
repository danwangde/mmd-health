let obj = {
    func () {
        console.log(this)
    },
    say () {
        let that = this;
        setTimeout(function () {
            console.log(that)
        },2000)
    }
}

obj.func()