<script>
	import {page} from "$app/stores";
</script>

<div class="flex px-4 border-b border-gray-300">
	<a class="p-2" class:text-blue-500={$page.path === "/students/membership/1"} href="/students/membership/1">Existing</a>
	<a class="p-2" class:text-blue-500={$page.path === "/students/membership/0"} href="/students/membership/0">Other</a>
</div>
<slot></slot>