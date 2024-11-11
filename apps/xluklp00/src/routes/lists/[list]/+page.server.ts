import { listManager} from '$lib/script/index.js';
import { error } from '@sveltejs/kit';
import type { List } from 'backend';

export async function load({ params }): Promise<List> {
	const list = await listManager.getListData(params.list);
	
	if(list === null) {
		error(404, 'Not found');
	}

	return list;
}