// Author: Pavel Lukl, xluklp00
// Description: Server-side script for loading list data on page access

import { listManager} from '$lib/script/index.js';
import { error } from '@sveltejs/kit';
import type { List } from 'backend';

// on access to /lists/[list], load the list data from the BE on the server
export async function load({ params }): Promise<List> {
	const list = await listManager.getListData(params.list);
	
	if(list === null) {
		error(404, 'Not found');
	}

	return list;
}