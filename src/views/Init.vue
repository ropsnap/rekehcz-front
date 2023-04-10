<template>
	
	<div>
		<small> Carregando... </small>
	</div>

</template>

<script>
	
	export default {
		
		name: 'Init',
		
		created () {
			setTimeout(() => {
				window.location.replace(window.location.href + 'dash')
				window.reload()
			}, 3000);
		}
	}

</script>