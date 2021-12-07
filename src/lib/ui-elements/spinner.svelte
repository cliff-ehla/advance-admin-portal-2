<div class="lds-ripple"><div></div><div></div></div>

<style>
    .lds-ripple {
		    font-size: 14px;
        display: inline-block;
        position: relative;
        width: 3.6em;
        height: 3.6em;
    }
    .lds-ripple div {
        position: absolute;
        border: 0.2em solid black;
        opacity: 1;
        border-radius: 50%;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .lds-ripple div:nth-child(2) {
        animation-delay: -0.5s;
    }
    @keyframes lds-ripple {
        0% {
            top: 1.8em;
            left: 1.8em;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: 0px;
            left: 0px;
            width: 3.6em;
            height: 3.6em;
            opacity: 0;
        }
    }
</style>