import {usermodel} from "$lib/usermodal";

/**
 * "item_id": 23343,
 * tutor_course_id: '',
 * "teacher_id": 29900,
 * "start_date":"2021-12-01 12:00:00",
 * "duration":40,
 * "ticket":2,
 * "student_size":4,
 * is_always_open: Boolean
 * @param req
 * @returns {Promise<{body: any, status: number}>}
 */
export const post = (req) => {
	return usermodel(req, '/courseApi/batch_reg_course', {
		course_data: req.body.course_data
	})
}