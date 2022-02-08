import {usermodel} from "$lib/usermodal";
import dayjs from "dayjs";

export const post = (req) => {
	return usermodel(req, '/classroomApi/create_tutor_classroom', {
		teacher_id: req.body.teacher_id,
		title: req.body.title,
		syllabus_id: req.body.syllabus_id,
		start_date: dayjs().format('YYYY-MM-DD HH:ss:ss'),
		end_date: dayjs().add(6, 'month').format('YYYY-MM-DD HH:ss:ss')
	})
}