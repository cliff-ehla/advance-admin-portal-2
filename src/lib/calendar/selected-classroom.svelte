<script>
	import {big_class_events} from "$lib/store/big-class-store.js";
	import dayjs from "dayjs";
</script>

{#each $big_class_events.selected_events as e}
	<div class="mb-4">
		{e.extendedProps.student_size > 4 ? '大班課' : '小組課'}:
		{dayjs(e.start_date).format('MMMDD日  (ddd) h:mma')}
		{e.extendedProps.sub_cat_alter}
		({e.extendedProps.duration}分鐘)
	</div>
<!--	大班課：2月14日 星期一 晚7:50分 小四預備程度 /小五呈分試 《閱讀理解解題技巧提升課堂》 （50-60分鐘課堂）-->
<!--	小組課：2月13日 星期日 下午 2:45分 小三四程度 《外籍老師寫作補底增強班》-->
{/each}