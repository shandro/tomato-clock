class Timer {
	constructor() {
		this.timer = {};
		this.badge = new Badge();
		this.notificationSound = new Audio('/assets/sounds/Portal2_sfx_button_positive.m4a');
		this.timeline = new Timeline();

		this.resetTimer();
	}

	getTimer() {
		return this.timer;
	}

	resetTimer() {
		clearInterval(this.timer.interval);

		this.timer = {
			interval: null,
			scheduledTime: null,
			totalTime: 0,
			timeLeft: 0
		};

		this.badge.setBadgeText('');
	}

	setTimer(milliseconds) {
		this.resetTimer();

		this.timer = {
			interval: setInterval(() => {
				const timer = this.getTimer();

				timer.timeLeft -= getSecondsInMilliseconds(1);

				if (timer.timeLeft <= 0) {
					const {minutes} = getMillisecondsToMinutesAndSeconds(timer.totalTime);

					this.createBrowserNotification(minutes);
					this.timeline.addAlarmToTimeline(minutes);
					this.resetTimer();
				} else {
					const minutesLeft = getMillisecondsToMinutesAndSeconds(timer.timeLeft).minutes.toString();

					if (this.badge.getBadgeText() !== minutesLeft) {
						this.badge.setBadgeText(minutesLeft);
					}
				}
			}, getSecondsInMilliseconds(1)),
			scheduledTime: Date.now() + milliseconds,
			totalTime: milliseconds,
			timeLeft: milliseconds
		};

		const {minutes} = getMillisecondsToMinutesAndSeconds(milliseconds);
		this.badge.setBadgeText(minutes.toString());
	}

	createBrowserNotification(totalMinutes) {
		const isAlarmTomato = totalMinutes === MINUTES_IN_TOMATO;

		// this.notificationSound.onended = () => {
		browser.notifications.create(NOTIFICATION_ID, {
			type: 'basic',
			iconUrl: '/assets/img/tomato-icon-64.png',
			title: 'Tomato Clock',
			message: isAlarmTomato ?
				'Your Tomato timer is done!' :
				`Your ${totalMinutes} minute timer is done!`
		});
		// };

		this.notificationSound.play();
	}

	getTimerScheduledTime() {
		return this.timer.scheduledTime;
	}
}
