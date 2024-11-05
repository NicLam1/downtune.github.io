
<template>
    <body>
	
	<div>
		<nav class="menu">
			<div class="menu__item">
				<router-link to="/login/band" class="menu__item-link">Artists</router-link>
				<img class="menu__item-img" src="./chooseUserTypeImg/band1.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/band2.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/band3.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/band7.jpg"/>
                <img class="menu__item-img" src="./chooseUserTypeImg/band5.jpg"/>
				<div class="marquee">
					<div class="marquee__inner">
						<span>Artists</span>
						<span>Artists</span>
						<span>Artists</span>
						<span>Artists</span>
					</div>
				</div>
			</div>
			<div class="menu__item">
				<router-link to="/login/user" class="menu__item-link">Listener</router-link>
                <img class="menu__item-img" src="./chooseUserTypeImg/fan3.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/fan6.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/fan4.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/fan2.jpg"/>
				<img class="menu__item-img" src="./chooseUserTypeImg/fan5.jpg"/>
				<div class="marquee">
					<div class="marquee__inner">
						<span>Listener</span>
						<span>Listener</span>
						<span>Listener</span>
						<span>Listener</span>
					</div>
				</div>
			</div>
		</nav>
	</div>
</body>
</template>

<style scoped>

body {
	margin: 0;
	font-family: "Monument Extended", sans-serif;
	background: url(https://media.giphy.com/media/3oEduMhFrYvKk4giac/giphy.gif) no-repeat 50% 50%;
	background-size: cover;
	overflow: hidden; /* Disable both horizontal and vertical scrolling */
}

.menu__item {
	position: relative;
	padding: 0 6vw;
}

.menu__item-link {
	display: inline-block;
	cursor: pointer;
	position: relative;
	-webkit-text-stroke: 1.5px #ffff;
	-webkit-text-fill-color: transparent;
	color: transparent;
	transition: opacity 0.4s;
	text-decoration: none;
}

.menu__item-link::before {
	all: initial;
	font-family: sofia-pro, sans-serif;
	counter-increment: menu;
	position: absolute;
	bottom: 60%;
	left: 0;
	pointer-events: none;
}

.menu__item-link:hover {
	transition-duration: 0.1s;
	opacity: 0;
}

.menu__item-img {
	pointer-events: none;
	position: absolute;
	height: 50vh;
	max-height: 400px;
	opacity: 0;
	left: 100%;
	top: 50%;
	transform: translate3d(calc(-100% - 6vw),-30%,0) translate3d(0,20px,0);
}

.menu__item-link:hover + .menu__item-img {
	opacity: 1;
	transform: translate3d(calc(-100% - 6vw),-30%,0) rotate3d(0,0,1,4deg);
	transition: all 0.4s;
}

.menu {
	padding: 20vh 0 50vh;
	--offset: 20vw;
	--move-initial: calc(-25% + var(--offset));
	--move-final: calc(-50% + var(--offset));
	font-size: 7vw;
}

.marquee {
	position: absolute;
	top: 0;
	left: 0;
	overflow: hidden;
	color: #fff;
	pointer-events: none;
	mix-blend-mode: difference;
}

.marquee__inner {
	width: fit-content;
	display: flex;
	position: relative;
	animation: marquee 5s linear infinite;
	animation-play-state: paused;
	opacity: 0;
	transition: opacity 0.1s;
}

.menu__item-link:hover ~ .marquee .marquee__inner {
	animation-play-state: running;
	opacity: 1;
	transition-duration: 0.4s;
}


.menu__item-link,
.marquee span {
	white-space: nowrap;
	font-size: 7vw;
	padding: 0 1vw;
	font-weight: 900;
	line-height: 1.15;
}

.marquee span {
	font-style: italic;
}

@keyframes marquee {
	0% {
		transform: translate3d(var(--move-initial), 0, 0);
	}

	100% {
		transform: translate3d(var(--move-final), 0, 0);
	}
}
/* display images */
.menu__item-img {
    pointer-events: none;
    position: absolute;
    height: 50vh;
    max-height: 400px;
    opacity: 0;
    transition: opacity 0.4s, transform 0.4s;
}

.menu__item-img:nth-child(1) {
    height: 30vh; /* First image height (lowest) */
    max-height: 250px; /* First image max height */
    left: 0; /* Position */
    top: 50%;
    transform: translate3d(0, -30%, 0) translate3d(0, 20px, 0);
}

.menu__item-img:nth-child(2) {
    height: 40vh; /* Second image height (higher than the first) */
    max-height: 300px; /* Second image max height */
    left: 20vw; /* Position */
    top: 50%;
    transform: translate3d(0, -30%, 0) translate3d(0, 20px, 0);
}

.menu__item-img:nth-child(3) {
    height: 50vh; /* Third image height (higher than the second) */
    max-height: 350px; /* Third image max height */
    left: 40vw; /* Position */
    top: 50%;
    transform: translate3d(0, -30%, 0) translate3d(0, 20px, 0);
}

.menu__item-img:nth-child(4) {
    height: 60vh; /* Fourth image height (higher than the third) */
    max-height: 400px; /* Fourth image max height */
    left: 60vw; /* Position */
    top: 50%;
    transform: translate3d(0, -30%, 0) translate3d(0, 20px, 0);
}

.menu__item-img:nth-child(5) {
    height: 70vh; /* Fifth image height (highest) */
    max-height: 450px; /* Fifth image max height */
    left: 80vw; /* Position */
    top: 50%;
    transform: translate3d(0, -30%, 0) translate3d(0, 20px, 0);
}

.menu__item-link:hover ~ .menu__item-img:nth-child(1) {
    opacity: 1;
    transform: translate3d(0,-30%,0) rotate3d(0,0,1,4deg);
    transition: all 0.4s;
}

.menu__item-link:hover ~ .menu__item-img:nth-child(2) {
    opacity: 1;
    transform: translate3d(0,-30%,0) rotate3d(0,0,1,-2deg);
    transition: all 0.4s 0.1s;
}

.menu__item-link:hover ~ .menu__item-img:nth-child(3) {
    opacity: 1;
    transform: translate3d(0,-30%,0) rotate3d(0,0,1,3deg);
    transition: all 0.4s 0.2s;
}

.menu__item-link:hover ~ .menu__item-img:nth-child(4) {
    opacity: 1;
    transform: translate3d(0,-30%,0) rotate3d(0,0,1,-5deg);
    transition: all 0.4s 0.3s;
}

.menu__item-link:hover ~ .menu__item-img:nth-child(5) {
    opacity: 1;
    transform: translate3d(0,-30%,0) rotate3d(0,0,1,5deg);
    transition: all 0.4s 0.4s;
}

</style>
