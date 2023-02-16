import React, { useState, useEffect } from "react"
import { useParams } from "react-router"
import { Device } from "twilio-client"
import $ from "jquery"
import "./index.css"

function Call() {
	const [onPhone, setOnPhone] = useState(false)
	const [muted, setMuted] = useState(false)
	const [connected, setConnected] = useState(false)
	const { contact } = useParams()

	const [second, setSeconds] = useState(0)
	const [minute, setMinutes] = useState(0)
	const [hour, setHours] = useState(0)

	useEffect(() => {
		if (onPhone) {
			if (minute >= 2) {
				handleEndCall()
			}
			const timer = () => {
				if (second < 60) {
					setSeconds(second + 1)
					setConnected(true)
				} else {
					setSeconds(0)
					setMinutes(minute + 1)
					if (minute < 60) {
						setMinutes(minute + 1)
					} else {
						setMinutes(0)
						setHours(hour + 1)
					}
				}
			}
			const interval = setInterval(() => {
				timer()
			}, 1000)
			return () => clearInterval(interval)
		}
	})

	useEffect(() => {
		// Fetch Twilio capability token from our Node.js server
		$.getJSON("https://medic-staging.baobabcircle.com/token")
			.done(function (data) {
				Device.setup(data.token)
			})
			.fail(function (err) {
				console.log(err)
				// self.setState({ log: "Could not fetch token, see console.log" })
			})
		// Configure event handlers for Twilio Device
		Device.on("disconnect", function () {
			setOnPhone(false)
		})
	}, [contact, onPhone])

	const handleToggleMute = () => {
		if (muted) {
			setMuted(false)
			Device.activeConnection().mute(false)
		} else {
			Device.activeConnection().mute(true)
			setMuted(true)
		}
	}
	const handleCallBack = () => {
		setConnected(false)
		setSeconds(0)
		setMinutes(0)
		setHours(0)
		if (!onPhone) {
			setMuted(false)
			setOnPhone(true)
			const number = "+" + contact
			Device.connect({ number })
		} else {
			Device.disconnectAll()
		}
	}
	const initCall = () => {
		setConnected(false)
		setSeconds(0)
		setMinutes(0)
		setHours(0)
		if (!onPhone) {
			setMuted(false)
			setOnPhone(true)
			const number = "+" + contact
			Device.connect({ number })
		}
	}
	const onClose = () => {
		window.opener = null
		window.open("", "_self")
		window.close()
	}
	const handleEndCall = () => {
		setOnPhone(false)
		Device.disconnectAll()
		onClose()
	}
	return (
		<>
			<div className="dialer">
				<div className="call-screen">
					<div className="call-info">
						<div className="call-type">
							<p>Outgoing Voice Call</p>
						</div>
						<div className="contact">
							<p>{contact}</p>

							<div className="avatar">
								<div className="graphic">
									<svg
										viewBox="0 0 118 118"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											opacity="0.8"
											d="M58.9928 117.848C91.494 117.848 117.841 91.5007 117.841 58.9996C117.841 26.4984 91.494 0.15094 58.9928 0.15094C26.4916 0.15094 0.144165 26.4984 0.144165 58.9996C0.144165 91.5007 26.4916 117.848 58.9928 117.848Z"
											fill="#FCFCFC"
										/>
										<mask
											id="mask0_1_31"
											style={{ maskType: "alpha" }}
											maskUnits="userSpaceOnUse"
											x="0"
											y="0"
											width="118"
											height="118"
										>
											<path
												d="M58.9928 117.848C91.494 117.848 117.841 91.5007 117.841 58.9996C117.841 26.4984 91.494 0.15094 58.9928 0.15094C26.4916 0.15094 0.144165 26.4984 0.144165 58.9996C0.144165 91.5007 26.4916 117.848 58.9928 117.848Z"
												fill="#FF0000"
											/>
										</mask>
										<g mask="url(#mask0_1_31)">
											<path
												d="M60.901 122.94C40.8684 122.959 23.8503 119.468 7.53878 112.498C5.96375 111.825 5.78713 111.452 6.1573 109.708C6.4815 108.181 6.67021 106.621 7.09603 105.126C8.60089 99.8295 12.1695 96.769 17.5212 95.6585C25.5899 93.9843 33.6489 92.2592 41.7176 90.585C42.4724 90.4278 42.8934 90.1713 42.7434 89.3463C42.7216 89.2302 42.7265 89.1044 42.7434 88.9858C43.0918 86.5059 42.4265 84.464 40.6337 82.5865C38.8216 80.6897 38.3619 78.113 38.2216 75.5436C38.1804 74.8033 37.8853 74.467 37.2272 74.138C33.3586 72.2121 31.6069 68.9193 31.3602 64.7193C31.2561 62.9458 31.2779 61.1773 31.844 59.4667C32.4368 57.674 33.4626 56.2223 35.282 55.5134C35.8409 55.2957 35.9425 54.9763 35.9643 54.4392C36.0465 52.2206 35.6909 50.0263 35.6231 47.8149C35.3594 39.2309 40.3095 31.7792 48.3975 28.8928C55.8541 26.2315 63.3252 26.4129 70.6536 29.3961C79.0489 32.8147 83.5175 40.7672 82.4191 50.0795C82.2401 51.594 82.0296 53.1061 81.8263 54.6183C81.7707 55.0271 81.7126 55.3659 82.2231 55.6054C84.4466 56.6409 85.5063 58.5764 85.7675 60.8627C86.22 64.8112 86.0579 68.6798 83.1498 71.8565C82.2159 72.8775 81.132 73.7025 79.8618 74.2517C79.3513 74.4718 79.1457 74.7718 79.136 75.338C79.0755 78.926 77.7182 81.9768 75.1924 84.5051C74.7182 84.9793 74.5778 85.4898 74.5996 86.1285C74.648 87.493 74.1593 89.1963 74.8053 90.1302C75.5045 91.1439 77.3747 90.9358 78.7344 91.2286C86.1208 92.823 93.5556 94.2044 100.896 95.973C106.33 97.2819 109.441 101.061 110.491 106.536C110.716 107.714 110.968 108.888 111.191 110.066C111.391 111.131 111.135 111.876 110.01 112.36C101.126 116.185 91.9443 118.996 82.4336 120.762C74.5561 122.221 66.6204 122.959 60.901 122.94ZM57.4001 105.455C58.801 105.651 60.1921 105.498 61.576 105.3C66.0108 104.663 69.9011 102.902 73.0899 99.6989C74.7666 98.2739 75.94 96.4666 76.9997 94.5722C77.2706 94.0859 77.14 93.827 76.6053 93.7278C76.2109 93.6552 75.8238 93.5512 75.4295 93.481C74.9238 93.3915 74.4762 93.4931 74.5924 94.1246C74.8319 95.4408 73.9923 95.4432 73.1044 95.4262C71.9842 95.5593 71.51 95.1408 71.6576 93.9528C71.7617 93.123 71.6721 92.2665 71.6528 91.4221C71.631 90.4568 71.8221 89.4745 71.5221 88.4293C70.6342 89.3052 69.8165 90.0745 69.0398 90.885C67.5447 92.4504 65.7495 93.3915 63.6035 93.7472C61.201 94.1464 58.7889 93.873 56.384 93.948C52.9871 94.0569 50.079 93.0141 47.8338 90.3334C47.2169 89.5955 46.5757 88.8261 45.6104 88.2963C45.6104 89.7479 45.608 91.0737 45.6128 92.3996C45.6128 92.598 45.6515 92.7988 45.6709 92.9972C45.6515 93.5585 45.6322 94.1198 45.608 94.6811C45.5983 94.9182 45.6249 95.2787 45.3709 95.3028C44.616 95.373 43.8321 95.4553 43.0942 95.3295C42.4192 95.2157 42.8063 94.5286 42.7168 94.1004C42.6612 93.8294 42.7144 93.4738 42.3249 93.4714C41.6426 93.4665 40.9555 93.5899 40.3676 93.9214C40.0966 94.0738 40.3772 94.4367 40.5006 94.6762C41.3716 96.3674 42.4749 97.9037 43.8031 99.2537C47.5387 103.059 52.0823 105.116 57.4001 105.455ZM46.0749 84.2801C47.8048 86.0656 49.5226 87.8656 51.2742 89.6294C51.7533 90.1132 52.3581 90.4544 53.0621 90.5463C53.3234 90.6358 53.5799 90.7665 53.8484 90.8124C56.6695 91.2963 59.5147 91.0713 62.3454 90.9939C63.918 90.9504 65.4253 90.3987 66.5696 89.2302C68.2172 87.5463 69.8092 85.8067 71.4254 84.0914C74.4569 81.3962 76.569 78.263 76.2521 73.9686C76.1674 72.8267 76.7021 72.2145 77.8174 71.9097C80.44 71.1863 82.1191 69.483 82.6707 66.7927C82.9272 65.5418 83.1764 64.2596 83.1715 62.9942C83.1667 61.3055 82.9417 59.6143 81.4175 58.4627C80.607 57.8506 79.9247 57.8361 79.2594 58.6974C78.6207 59.5224 78.4271 60.4901 78.1368 61.4506C77.8803 62.3023 78.2795 63.3378 77.4279 64.0152C76.6609 63.9184 76.4746 63.4104 76.4819 62.7281C76.4916 61.724 76.5134 60.7176 76.4553 59.7159C76.3513 57.9474 76.1601 56.1691 75.1343 54.657C74.4907 53.7062 74.2173 52.7287 74.2803 51.6013C74.3286 50.7593 74.2899 49.915 74.2899 49.0706C74.2899 46.6947 73.6343 45.8939 71.3334 45.2238C68.2487 44.3237 65.118 43.6197 61.922 43.3511C58.9679 43.1019 55.992 43.0923 53.0646 43.7503C50.3694 43.9802 47.7927 44.7254 45.2717 45.6423C44.1515 46.0488 43.6459 47.0262 43.6289 48.2165C43.6144 49.3004 43.5878 50.3867 43.6338 51.4682C43.6821 52.6416 43.4184 53.682 42.6733 54.6086C42.1362 55.2763 41.8603 56.0747 41.7079 56.9143C41.3474 58.8933 41.374 60.9014 41.2482 62.8974C41.1757 64.0588 40.9434 64.2088 39.8571 63.7394C39.8111 62.2926 39.7216 60.8555 39.1071 59.503C38.2627 57.6498 36.7312 57.4127 35.3473 58.9345C34.8465 59.4837 34.5538 60.1418 34.3771 60.8506C34.0626 62.1208 34.1546 63.4176 34.2634 64.6902C34.5804 68.3435 35.9691 71.2008 39.966 72.05C40.7111 72.2073 40.9918 72.8267 41.0305 73.6081C41.0886 74.8468 41.1515 76.1001 41.3861 77.3146C41.9595 80.2784 44.0838 82.2429 46.0749 84.2801ZM10.0912 105.784C9.68962 106.911 9.64123 108.114 9.34607 109.258C9.17187 109.928 9.52268 110.119 9.9993 110.303C11.9421 111.053 13.8703 111.852 15.8325 112.546C24.9488 115.771 34.2876 118.016 43.9168 119.102C48.7363 119.647 53.5678 119.826 58.3993 119.986C61.1163 120.075 63.843 119.763 66.5721 119.748C68.5632 119.739 70.5616 119.519 72.5407 119.252C76.8109 118.681 81.0667 118.033 85.2885 117.143C92.8782 115.541 100.214 113.156 107.385 110.233C107.748 110.085 108.135 109.943 107.98 109.367C107.663 108.184 107.624 106.933 107.155 105.781C106.405 102.263 104.232 99.9045 100.831 99.0674C94.8959 97.6085 88.8934 96.4158 82.9078 95.177C80.2344 94.623 80.2199 94.6956 78.8916 97.0884C78.086 98.1795 77.3698 99.3553 76.4553 100.347C72.7076 104.422 68.1616 107.042 62.6502 108.043C57.855 108.914 53.3259 108.205 48.9516 106.243C44.6281 104.305 41.2966 101.175 38.5917 97.3327C38.3014 96.7593 37.9724 96.2029 37.7353 95.6077C37.4111 94.7972 36.9707 94.6061 36.0659 94.8045C29.7875 96.1811 23.4971 97.4948 17.2043 98.794C13.6187 99.5368 10.6646 102.404 10.0912 105.784ZM39.5813 57.0377C40.6095 54.703 40.6047 52.2255 40.5006 49.748C40.4571 48.6908 40.6264 47.6504 40.8273 46.6512C42.4531 38.6091 47.2604 33.5332 55.1985 31.3969C57.2646 30.8404 59.3526 30.5211 61.4841 30.3517C60.5768 30.1872 59.6647 29.9816 58.7647 30.0154C55.7283 30.134 52.7452 30.4945 49.7863 31.3316C42.3733 33.4292 37.7982 40.0245 37.6143 47.3964C37.5562 49.765 37.9143 52.1021 38.0522 54.4538C38.1272 55.736 38.4877 56.5925 39.5813 57.0377Z"
												fill="#BBBBBB"
											/>
											<path
												d="M38.5869 97.3351C41.2918 101.175 44.6257 104.305 48.9468 106.246C53.3186 108.208 57.8502 108.917 62.6454 108.046C68.1568 107.044 72.7052 104.424 76.4505 100.35C77.365 99.3553 78.0787 98.1819 78.8868 97.0908C79.1747 97.4174 79.5909 97.4803 79.9707 97.5481C85.1651 98.4723 90.2701 99.7908 95.404 100.984C99.5654 101.951 103.831 102.73 107.15 105.784C107.62 106.935 107.658 108.184 107.975 109.369C108.13 109.945 107.741 110.088 107.38 110.235C100.209 113.158 92.8733 115.544 85.2837 117.145C81.0618 118.036 76.8061 118.686 72.5359 119.255C70.5592 119.519 68.5584 119.739 66.5672 119.751C63.8382 119.765 61.1115 120.077 58.3945 119.988C53.563 119.828 48.7314 119.649 43.912 119.105C34.2828 118.019 24.9464 115.773 15.8277 112.548C13.8655 111.854 11.9373 111.056 9.99449 110.306C9.51787 110.122 9.16947 109.931 9.34125 109.26C9.63642 108.116 9.68481 106.914 10.0864 105.786C12.5034 103.768 15.2712 102.525 18.3487 101.857C22.8004 100.892 27.2278 99.8126 31.665 98.7747C33.9634 98.2327 36.2425 97.6327 38.5869 97.3351Z"
												fill="#BBBBBB"
											/>
											<path
												d="M71.4254 84.0914C69.8092 85.8067 68.2172 87.5438 66.5696 89.2302C65.4253 90.3987 63.9156 90.9503 62.3454 90.9939C59.5147 91.0713 56.6695 91.2963 53.8485 90.8124C53.5799 90.7665 53.3234 90.6382 53.0621 90.5463C53.7347 88.9277 55.1477 88.8987 56.5824 88.8818C57.105 88.8745 57.7921 89.1818 57.7485 88.1124C57.7292 87.6334 58.3171 87.3963 58.8663 87.4446C59.2873 87.4834 59.626 87.7035 59.5486 88.1148C59.3574 89.114 60.0349 88.9156 60.5429 88.8697C62.043 88.7293 62.6284 88.0737 62.9962 86.6922C63.4317 85.0519 62.6454 84.0285 61.5155 83.0946C61.7744 82.3179 60.9736 81.9937 60.7921 81.4034C61.9099 81.2099 63.0059 80.9752 63.6954 79.9348C64.1744 79.9421 64.6559 79.9469 65.1349 79.9542C65.6164 79.9614 66.0422 79.8598 66.0761 79.2816C66.11 78.7155 65.7495 78.5219 65.2366 78.5074C64.339 78.4832 63.5406 78.0985 62.7204 77.7888C62.7083 77.305 62.3938 77.1453 61.9825 77.0122C60.93 76.6759 59.8969 76.7751 58.859 77.0582C58.8276 76.7098 59.0187 76.1727 58.726 76.0469C57.4146 75.4856 58.0534 74.363 57.8864 73.4775C59.9937 73.8597 61.6607 72.2702 63.6688 72.1734C64.0196 72.1565 64.1793 71.8105 64.1502 71.4476C64.114 71.0145 63.8454 70.8258 63.4341 70.7895C62.3913 70.7024 61.4454 71.0798 60.5623 71.525C59.4131 72.1057 58.2566 72.1589 57.0759 71.8153C56.0453 71.5153 55.1017 70.9516 54.0275 70.7581C54.1364 70.1726 54.6033 70.3419 54.9783 70.296C56.1203 70.1556 57.0493 70.8089 58.0703 71.1186C59.1155 71.4355 60.0228 71.1694 60.6034 70.296C61.2034 69.3959 61.3099 68.3483 60.3542 67.5983C59.0332 66.5604 58.7139 65.2249 58.8542 63.662C58.9026 63.1055 58.8929 62.5394 58.8518 61.9829C58.7719 60.8337 58.1574 60.449 57.0275 60.5458C56.1904 60.6184 55.2348 61.1071 54.5089 60.2047C54.8235 60.1127 55.3074 60.3232 55.409 59.8417C55.5033 59.3942 55.0727 59.2756 54.7654 59.1183C53.6017 58.5256 52.3702 58.107 51.1315 57.703C52.6968 55.5401 53.2097 53.1182 53.0888 50.4763C52.9871 48.2359 53.0694 45.9883 53.0694 43.7431C55.9969 43.085 58.9727 43.0947 61.9268 43.3439C65.1204 43.6124 68.2511 44.3165 71.3383 45.2165C73.6367 45.8867 74.2948 46.6875 74.2948 49.0633C74.2948 49.9077 74.3335 50.7521 74.2851 51.594C74.2198 52.7215 74.4932 53.7013 75.1391 54.6497C76.165 56.1594 76.3537 57.9377 76.4601 59.7087C76.5206 60.7103 76.4988 61.7168 76.4867 62.7208C76.4795 63.4031 76.6658 63.9112 77.4327 64.0079C78.3642 66.1007 77.2876 69.529 75.2891 71.0266C73.5762 72.3113 72.4609 74.0146 71.8463 76.0832C71.0576 78.7324 71.5584 81.4228 71.4254 84.0914ZM68.3648 57.4949C66.1124 57.5578 64.0607 58.3199 62.0792 59.3216C61.8397 59.4425 61.5204 59.5974 61.6171 59.9361C61.7187 60.2942 62.0768 60.195 62.3381 60.1756C62.8147 60.1417 63.2914 60.0764 63.7631 59.9966C66.6761 59.4982 69.5745 58.7312 72.5552 59.5127C72.8552 59.5901 73.131 59.6724 73.2593 59.324C73.3851 58.978 73.102 58.8353 72.848 58.6974C71.452 57.9377 69.9762 57.4732 68.3648 57.4949ZM67.2084 64.0394C67.956 63.9475 68.5052 63.5096 68.481 62.6603C68.4568 61.8184 67.9148 61.3587 67.0584 61.3635C66.2164 61.3684 65.8341 61.8498 65.8245 62.6652C65.8124 63.5434 66.2285 64.0152 67.2084 64.0394Z"
												fill="#BBBBBB"
											/>
											<path
												d="M61.5155 83.0946C62.6478 84.0309 63.4341 85.0543 62.9962 86.6922C62.6284 88.0737 62.0429 88.7269 60.5429 88.8697C60.0348 88.9181 59.3598 89.114 59.5485 88.1148C59.6259 87.7035 59.2872 87.4834 58.8662 87.4446C58.317 87.3938 57.7291 87.6309 57.7485 88.1124C57.792 89.1818 57.1049 88.8745 56.5823 88.8818C55.1476 88.8987 53.7347 88.9302 53.0621 90.5463C52.3557 90.4544 51.7532 90.1132 51.2742 89.6294C49.5225 87.8656 47.8048 86.0656 46.0749 84.2801C46.0725 82.4776 46.1499 80.6728 46.0459 78.8751C45.8789 75.9912 44.9329 73.342 42.6732 71.4694C41.1079 70.1726 40.0651 68.6967 39.6974 66.7322C39.5087 65.7281 39.2958 64.7072 39.8571 63.7346C40.9458 64.2039 41.1756 64.0539 41.2482 62.8926C41.374 60.8966 41.3474 58.8885 41.7079 56.9094C41.8627 56.0699 42.1361 55.2715 42.6732 54.6038C43.4184 53.6771 43.6821 52.6344 43.6337 51.4634C43.5878 50.3819 43.6144 49.2956 43.6289 48.2117C43.6458 47.0214 44.1539 46.0439 45.2717 45.6375C47.7927 44.7205 50.3693 43.9753 53.0645 43.7455C53.0645 45.9907 52.9823 48.2383 53.0839 50.4787C53.2049 53.1207 52.6919 55.5425 51.1266 57.7054C48.7314 57.0498 46.4475 57.3836 44.2483 58.482C43.9966 58.6079 43.6603 58.6998 43.7281 59.0433C43.8079 59.4546 44.1902 59.4764 44.5023 59.3845C45.2112 59.1788 45.9322 59.2054 46.6531 59.1692C49.3362 59.0361 51.8935 59.82 54.5065 60.2071C55.2323 61.1095 56.188 60.6208 57.0251 60.5482C58.1549 60.4514 58.7671 60.8361 58.8493 61.9853C58.888 62.5418 58.9001 63.1079 58.8517 63.6644C58.7114 65.2273 59.0308 66.5628 60.3518 67.6008C61.3074 68.3508 61.1985 69.4008 60.601 70.2984C60.0203 71.1718 59.113 71.4355 58.0678 71.121C57.0469 70.8113 56.1178 70.1581 54.9759 70.2984C54.6009 70.3443 54.1339 70.175 54.025 70.7605C53.4613 70.7798 52.8444 70.7532 52.675 71.4548C52.5903 71.8057 52.9097 72.125 53.2049 72.1468C54.8621 72.2702 56.2218 73.4097 57.884 73.475C58.0509 74.3605 57.4122 75.4831 58.7235 76.0444C59.0163 76.1703 58.8251 76.7074 58.8566 77.0558C58.4719 76.9953 58.0824 76.9445 57.7001 76.8695C56.0041 76.5356 55.0267 76.809 54.5089 77.7743C53.6089 78.0695 52.7355 78.4614 51.7677 78.5122C51.4048 78.5316 51.1871 78.7542 51.1484 79.1195C51.1024 79.5671 51.3879 79.809 51.7605 79.8647C52.2661 79.9373 52.7887 79.9131 53.3041 79.93C55.0073 81.6937 57.209 81.4058 59.3405 81.3986C58.7332 81.9308 57.959 81.5389 57.2694 81.7566C56.7977 81.9042 56.2436 81.8679 56.2606 82.4679C56.2799 83.1599 56.8461 83.3341 57.4678 83.3292C58.8203 83.3268 60.1776 83.3921 61.5155 83.0946ZM49.779 64.0442C50.6524 63.9571 51.1508 63.5216 51.1363 62.6603C51.1218 61.8644 50.6693 61.395 49.8709 61.3684C49.0169 61.3394 48.5016 61.7966 48.4846 62.6555C48.4677 63.512 49.0024 63.9281 49.779 64.0442Z"
												fill="#BBBBBB"
											/>
											<path
												d="M45.6733 93.002C45.654 92.8036 45.6153 92.6028 45.6153 92.4044C45.6104 91.0786 45.6128 89.7528 45.6128 88.3011C46.5782 88.8285 47.2193 89.6003 47.8363 90.3383C50.0815 93.0189 52.9896 94.0617 56.3864 93.9528C58.7913 93.8754 61.2034 94.1512 63.6059 93.752C65.7519 93.3964 67.5447 92.4552 69.0423 90.8899C69.8165 90.0794 70.6367 89.31 71.5246 88.4342C71.8246 89.4818 71.6335 90.4616 71.6552 91.427C71.6746 92.2714 71.7641 93.1278 71.6601 93.9577C71.5125 95.1456 71.9891 95.5641 73.1069 95.4311C73.102 96.8561 73.0972 98.2787 73.0924 99.7037C69.906 102.907 66.0132 104.668 61.5784 105.305C60.1921 105.503 58.8034 105.655 57.4026 105.459C56.9501 104.417 56.2267 103.565 55.4598 102.75C53.4783 100.645 51.3275 98.7094 49.4186 96.5246C48.2984 95.2399 47.183 93.8923 45.6733 93.002Z"
												fill="#BBBBBB"
											/>
											<path
												d="M39.8571 63.737C39.2982 64.7096 39.5111 65.7281 39.6974 66.7346C40.0652 68.6992 41.1079 70.1726 42.6733 71.4718C44.933 73.3444 45.879 75.9936 46.0459 78.8776C46.1499 80.6728 46.0701 82.48 46.0749 84.2825C44.0838 82.2478 41.9595 80.2808 41.3861 77.3146C41.1515 76.1001 41.0886 74.8468 41.0305 73.6081C40.9942 72.8266 40.7111 72.2073 39.966 72.05C35.9691 71.2008 34.5804 68.3435 34.2634 64.6902C34.1522 63.4176 34.0602 62.1184 34.3772 60.8506C34.5538 60.1418 34.8465 59.4837 35.3473 58.9345C36.7312 57.4127 38.2627 57.6498 39.1071 59.503C39.7216 60.8506 39.8111 62.2878 39.8571 63.737Z"
												fill="#BBBBBB"
											/>
											<path
												d="M71.4254 84.0914C71.5584 81.4252 71.0552 78.7324 71.8415 76.088C72.456 74.017 73.5714 72.3162 75.2843 71.0315C77.2827 69.5338 78.3594 66.1056 77.4279 64.0128C78.2795 63.3354 77.8803 62.2999 78.1368 61.4482C78.4271 60.4877 78.6207 59.52 79.2594 58.695C79.9247 57.8336 80.607 57.8457 81.4175 58.4603C82.9417 59.6119 83.1667 61.3055 83.1715 62.9918C83.174 64.2596 82.9272 65.5418 82.6707 66.7902C82.1191 69.4806 80.44 71.1839 77.8174 71.9073C76.7045 72.2145 76.1674 72.8266 76.2521 73.9662C76.569 78.2606 74.4569 81.3937 71.4254 84.0914Z"
												fill="#BBBBBB"
											/>
											<path
												d="M39.5813 57.0377C38.4853 56.5925 38.1272 55.7384 38.0522 54.4562C37.9143 52.1045 37.5538 49.7674 37.6143 47.3988C37.7982 40.0269 42.3733 33.4292 49.7863 31.334C52.7476 30.4969 55.7308 30.134 58.7647 30.0178C59.6647 29.984 60.5744 30.1896 61.4841 30.3541C59.3526 30.5259 57.2622 30.8429 55.1985 31.3993C47.2605 33.5356 42.4507 38.6115 40.8273 46.6536C40.6265 47.6528 40.4571 48.6932 40.5007 49.7504C40.6047 52.2255 40.6095 54.7029 39.5813 57.0377Z"
												fill="#BBBBBB"
											/>
											<path
												d="M38.5869 97.3351C36.2425 97.6327 33.9634 98.2352 31.6698 98.7723C27.2351 99.8126 22.8052 100.889 18.3535 101.855C15.2736 102.522 12.5082 103.766 10.0912 105.784C10.6646 102.404 13.6211 99.5368 17.197 98.7989C23.4899 97.4997 29.7827 96.1835 36.0586 94.8093C36.9659 94.6109 37.4038 94.802 37.728 95.6125C37.9675 96.2053 38.2966 96.7618 38.5869 97.3351Z"
												fill="#BBBBBB"
											/>
											<path
												d="M107.15 105.784C103.831 102.728 99.5654 101.949 95.404 100.984C90.27 99.7908 85.1651 98.4723 79.9707 97.5481C79.5908 97.4803 79.1747 97.4174 78.8868 97.0908C80.215 94.698 80.2295 94.6278 82.903 95.1795C88.891 96.4182 94.8911 97.611 100.826 99.0699C104.228 99.907 106.403 102.266 107.15 105.784Z"
												fill="#BBBBBB"
											/>
											<path
												d="M45.6733 93.002C47.183 93.8948 48.3008 95.2399 49.4185 96.5222C51.325 98.7094 53.4783 100.642 55.4598 102.747C56.2267 103.563 56.9501 104.414 57.4025 105.457C52.0847 105.116 47.5411 103.059 43.8104 99.261C42.4821 97.911 41.3789 96.3746 40.5079 94.6835C40.3845 94.4464 40.1014 94.0835 40.3748 93.9286C40.9627 93.5972 41.6498 93.4714 42.3321 93.4786C42.7216 93.481 42.6684 93.8367 42.7241 94.1077C42.8136 94.5359 42.4265 95.2206 43.1015 95.3367C43.8394 95.4625 44.6209 95.3803 45.3781 95.3101C45.6346 95.2859 45.6056 94.9278 45.6152 94.6883C45.6322 94.1246 45.6515 93.5633 45.6733 93.002Z"
												fill="#BBBBBB"
											/>
											<path
												d="M73.0899 99.7013C73.0947 98.2763 73.0996 96.8537 73.1044 95.4287C73.9923 95.4456 74.8319 95.4432 74.5923 94.127C74.4786 93.4956 74.9238 93.3939 75.4295 93.4835C75.8238 93.5536 76.2109 93.6577 76.6053 93.7302C77.14 93.8294 77.2706 94.0883 76.9997 94.5746C75.94 96.469 74.7665 98.2763 73.0899 99.7013Z"
												fill="#BBBBBB"
											/>
											<path
												d="M53.3041 79.9348C52.7888 79.9179 52.2686 79.9421 51.7605 79.8695C51.3879 79.8163 51.1025 79.5719 51.1484 79.1243C51.1871 78.759 51.4049 78.5364 51.7678 78.5171C52.7355 78.4638 53.6089 78.0743 54.509 77.7792C57.2453 77.784 59.9816 77.7888 62.718 77.7913C63.5357 78.0985 64.3341 78.4832 65.2341 78.5098C65.7471 78.5243 66.1076 78.7179 66.0737 79.284C66.0398 79.8647 65.6116 79.9639 65.1325 79.9566C64.6535 79.9494 64.172 79.9421 63.693 79.9373C62.3768 79.1921 60.976 79.0445 59.5171 79.3808C58.9171 79.5187 58.2929 79.5792 57.7243 79.4195C56.1638 78.9792 54.7267 79.3252 53.3041 79.9348Z"
												fill="#BBBBBB"
											/>
											<path
												d="M54.5089 60.2071C51.896 59.82 49.3387 59.0361 46.6556 59.1692C45.9346 59.2054 45.2136 59.1788 44.5047 59.3845C44.1926 59.4764 43.8104 59.4546 43.7305 59.0433C43.6628 58.6998 43.9991 58.6079 44.2507 58.482C46.4499 57.3836 48.7338 57.0498 51.129 57.7054C52.3653 58.1095 53.5992 58.528 54.763 59.1208C55.0726 59.278 55.5033 59.3966 55.4065 59.8442C55.3073 60.3256 54.8234 60.1151 54.5089 60.2071Z"
												fill="#BBBBBB"
											/>
											<path
												d="M53.3041 79.9348C54.7267 79.3252 56.1638 78.9792 57.7243 79.4171C58.2929 79.5768 58.9171 79.5163 59.5171 79.3784C60.9736 79.0421 62.3744 79.1921 63.693 79.9348C63.0034 80.9752 61.9075 81.2099 60.7897 81.4034C60.3058 81.4034 59.8244 81.4034 59.3405 81.4034C57.209 81.4107 55.0073 81.6986 53.3041 79.9348Z"
												fill="#BBBBBB"
											/>
											<path
												d="M57.8864 73.4775C56.2219 73.4097 54.8622 72.2726 53.2073 72.1492C52.9121 72.1274 52.5904 71.8081 52.6775 71.4573C52.8492 70.7556 53.4662 70.7798 54.0275 70.7629C55.0993 70.9565 56.0453 71.5202 57.0735 71.8202C58.2542 72.1637 59.4106 72.1105 60.5599 71.5299C61.4429 71.0847 62.3889 70.7048 63.4317 70.7944C63.843 70.8282 64.1139 71.0194 64.1478 71.4524C64.1768 71.8153 64.0172 72.1613 63.6664 72.1783C61.6607 72.2702 59.9937 73.8622 57.8864 73.4775Z"
												fill="#BBBBBB"
											/>
											<path
												d="M68.3648 57.4949C69.9762 57.4732 71.452 57.9401 72.8504 58.6974C73.1044 58.8353 73.3875 58.978 73.2617 59.324C73.1335 59.6724 72.8577 59.5901 72.5577 59.5127C69.577 58.7337 66.6785 59.4982 63.7656 59.9966C63.2938 60.0764 62.8172 60.1418 62.3405 60.1756C62.0792 60.195 61.7212 60.2942 61.6196 59.9361C61.5228 59.5974 61.8421 59.4425 62.0817 59.3216C64.0583 58.3175 66.1124 57.5578 68.3648 57.4949Z"
												fill="#BBBBBB"
											/>
											<path
												d="M59.3405 81.4058C59.8244 81.4058 60.3058 81.4058 60.7897 81.4058C60.9712 81.9962 61.772 82.318 61.5131 83.097C60.1776 83.3946 58.8203 83.3293 57.4655 83.3389C56.8437 83.3438 56.28 83.1696 56.2582 82.4776C56.2413 81.8752 56.7953 81.9139 57.2671 81.7663C57.959 81.5462 58.7332 81.9357 59.3405 81.4058Z"
												fill="#BBBBBB"
											/>
											<path
												d="M62.7204 77.7913C59.984 77.7864 57.2477 77.784 54.5114 77.7792C55.0291 76.8138 56.0065 76.538 57.7025 76.8743C58.0848 76.9493 58.4719 77.0001 58.859 77.0606C59.8969 76.78 60.93 76.6783 61.9825 77.0146C62.3937 77.1453 62.7083 77.3074 62.7204 77.7913Z"
												fill="#BBBBBB"
											/>
											<path
												d="M67.2083 64.0394C66.2285 64.0152 65.8148 63.5434 65.8244 62.6652C65.8341 61.8498 66.2164 61.3684 67.0583 61.3635C67.9148 61.3587 68.4567 61.8184 68.4809 62.6603C68.5051 63.5096 67.9559 63.9475 67.2083 64.0394Z"
												fill="#BBBBBB"
											/>
											<path
												d="M49.779 64.0442C49 63.9281 48.4677 63.5096 48.4846 62.6531C48.5016 61.7942 49.0169 61.3394 49.871 61.366C50.6694 61.3926 51.1218 61.8644 51.1363 62.6579C51.1508 63.5241 50.6524 63.9571 49.779 64.0442Z"
												fill="#BBBBBB"
											/>
										</g>
									</svg>
								</div>
							</div>
						</div>
						{onPhone && (
							<div className="call-duration">
								<p className="label">Call Duration</p>
								<p className="time">
									{(hour > 9 && hour) || `0${hour}`}:
									{(minute > 9 && minute) || `0${minute}`}:
									{(second > 9 && second) || `0${second}`}
								</p>
							</div>
						)}
						{!onPhone && !connected && (
							<p className="label">Idle</p>
						)}
						{!onPhone && connected && (
							<p className="label">Disconnected</p>
						)}
					</div>
					<div className="call-controls">
						{onPhone && (
							<div className="flex-row-controls">
								<button
									className="call-control-button disabled"
									disabled
								>
									<div className="button_inner_wrap">
										<div className="call-control-button-graphic">
											<svg
												viewBox="0 0 64 64"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													width="64"
													height="64"
													rx="32"
													fill="black"
													fillOpacity="0.05"
												/>
												<path
													d="M34.2778 20V22.8611C38.2917 24.0556 41.2222 27.7778 41.2222 32.1806C41.2222 36.5833 38.2917 40.2917 34.2778 41.4861V44.3611C39.8333 43.0972 44 38.125 44 32.1806C44 26.2361 39.8333 21.2639 34.2778 20ZM37.75 32.1806C37.75 29.7222 36.3611 27.6111 34.2778 26.5833V37.7361C36.3611 36.75 37.75 34.625 37.75 32.1806ZM19 28.0139V36.3472H24.5556L31.5 43.2917V21.0694L24.5556 28.0139H19Z"
													fill="white"
												/>
											</svg>
										</div>
										<div className="call-control-button-label">
											Loud
										</div>
									</div>
								</button>
								<button
									onClick={() => handleEndCall()}
									className="call-control-button"
								>
									<div className="button_inner_wrap">
										<div className="call-control-button-graphic">
											<svg
												viewBox="0 0 75 75"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													y="3.05176e-05"
													width="75"
													height="75"
													rx="37.5"
													fill="#F2464F"
												/>
												<path
													d="M37.5001 33.9167C35.1668 33.9167 32.9063 34.2812 30.7918 34.9667V39.4875C30.7918 40.0562 30.4564 40.5666 29.9751 40.8C28.5459 41.5145 27.248 42.4333 26.096 43.4979C25.8335 43.7604 25.4689 43.9062 25.0751 43.9062C24.6668 43.9062 24.3022 43.7458 24.0397 43.4833L20.4231 39.8666C20.2867 39.7343 20.1789 39.5755 20.1062 39.3999C20.0334 39.2244 19.9974 39.0358 20.0002 38.8458C20.0002 38.4375 20.1606 38.0729 20.4231 37.8104C24.871 33.5958 30.8793 31 37.5001 31C44.1209 31 50.1292 33.5958 54.5771 37.8104C54.8396 38.0729 55 38.4375 55 38.8458C55 39.2541 54.8396 39.6187 54.5771 39.8812L50.9604 43.4979C50.6979 43.7604 50.3334 43.9208 49.925 43.9208C49.5313 43.9208 49.1667 43.7604 48.9042 43.5125C47.7434 42.4298 46.4318 41.5211 45.0105 40.8145C44.7646 40.6948 44.5575 40.5081 44.413 40.276C44.2686 40.0438 44.1926 39.7755 44.1938 39.502V34.9812C42.0938 34.2812 39.8334 33.9167 37.5001 33.9167Z"
													fill="white"
												/>
											</svg>
										</div>
										<div className="call-control-button-label">
											End Call
										</div>
									</div>
								</button>
								<button
									onClick={() => handleToggleMute()}
									className="call-control-button"
								>
									{!muted && (
										<div className="button_inner_wrap">
											<div className="call-control-button-graphic">
												<svg
													viewBox="0 0 64 64"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<rect
														width="64"
														height="64"
														rx="32"
														fill="black"
														fillOpacity="0.05"
													/>
													<path
														d="M41.4125 31.8421H39.1757C39.1757 32.8158 38.9651 33.7237 38.6099 34.5395L40.2283 36.1579C40.9651 34.8684 41.4125 33.4079 41.4125 31.8421ZM36.123 32.0658C36.123 31.9868 36.1493 31.9211 36.1493 31.8421V23.9474C36.1493 21.7632 34.3862 20 32.202 20C30.0178 20 28.2546 21.7632 28.2546 23.9474V24.1842L36.123 32.0658ZM22.0309 21.3158L20.3599 22.9868L28.2678 30.8947V31.8421C28.2678 34.0263 30.0178 35.7895 32.202 35.7895C32.4914 35.7895 32.7809 35.75 33.0572 35.6842L35.2414 37.8684C34.3072 38.3026 33.2678 38.5526 32.202 38.5526C28.5704 38.5526 25.2283 35.7895 25.2283 31.8421H22.9914C22.9914 36.3289 26.5704 40.0395 30.8862 40.6842V45H33.5178V40.6842C34.7151 40.5132 35.8467 40.0921 36.8599 39.5L42.373 45L44.0441 43.3289L22.0309 21.3158Z"
														fill="white"
													/>
												</svg>
											</div>
											<div className="call-control-button-label">
												Mute
											</div>
										</div>
									)}
									{muted && (
										<div className="button_inner_wrap">
											{" "}
											<div className="call-control-button-graphic">
												<svg
													viewBox="0 0 64 64"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<rect
														width="64"
														height="64"
														rx="32"
														fill="white"
													/>
													<path
														d="M41.4125 31.8421H39.1757C39.1757 32.8158 38.9651 33.7237 38.6099 34.5395L40.2283 36.1579C40.9651 34.8684 41.4125 33.4079 41.4125 31.8421ZM36.123 32.0658C36.123 31.9868 36.1493 31.9211 36.1493 31.8421V23.9474C36.1493 21.7632 34.3862 20 32.202 20C30.0178 20 28.2546 21.7632 28.2546 23.9474V24.1842L36.123 32.0658ZM22.0309 21.3158L20.3599 22.9868L28.2678 30.8947V31.8421C28.2678 34.0263 30.0178 35.7895 32.202 35.7895C32.4914 35.7895 32.7809 35.75 33.0572 35.6842L35.2414 37.8684C34.3072 38.3026 33.2678 38.5526 32.202 38.5526C28.5704 38.5526 25.2283 35.7895 25.2283 31.8421H22.9914C22.9914 36.3289 26.5704 40.0395 30.8862 40.6842V45H33.5178V40.6842C34.7151 40.5132 35.8467 40.0921 36.8599 39.5L42.373 45L44.0441 43.3289L22.0309 21.3158Z"
														fill="#003C5B"
													/>
												</svg>
											</div>
											<div className="call-control-button-label">
												Muted
											</div>
										</div>
									)}
								</button>
							</div>
						)}
					</div>
				</div>
				{!connected && !onPhone && (
					<div className="container">
						<div className="popup">
							<div className="heading">
								<h4>Start Direct Call</h4>
							</div>
							<div className="summary">
								<p>
									You're about to make a direct phone call to
									+{contact}
								</p>
							</div>
							<div className="controls">
								<button onClick={() => initCall()}>
									Continue
								</button>
							</div>
						</div>
						<div className="overlay"></div>
					</div>
				)}
				{connected && !onPhone && (
					<div className="container">
						<div className="popup">
							<div className="heading">
								<h4>Call Ended</h4>
							</div>
							<div className="summary">
								<p>
									Your call has ended. You can close the
									browser and go back to Medic app now
								</p>
							</div>
							<div className="controls">
								<button onClick={() => handleCallBack()}>
									Callback
								</button>
							</div>
						</div>
						<div className="overlay"></div>
					</div>
				)}
			</div>
		</>
	)
}

export default Call
