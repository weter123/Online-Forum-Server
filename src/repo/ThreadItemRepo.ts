import { isThreadBodyValid } from "../common/validators/ThreadValidators";
import { QueryArrayResult } from "./QueryArrayResult";
import { Thread } from "./Thread";
import { ThreadItem } from "./ThreadItem";
import { User } from "./User";

export const createThreadItem = async(
    userId: string | undefined | null,
    threadId: string,
    body: string
): Promise<QueryArrayResult<ThreadItem>> => {
    const bodyMsg = isThreadBodyValid(body);
    if(bodyMsg){
        return {
            messages: [bodyMsg],
        };
    }

    if(!userId){
        return{
            messages: ["User not logged in."],
        };
    }

    const user = await User.findOne({
        where: { id : userId}
    });

    if(!user){
        return{
            messages: ["User not logged in."],
        };
    }

    const thread = await Thread.findOne({
        where: {id: threadId}
    });

    if(!thread){
        return{
            messages:["Thread not found."],
        };
    }

    const threadItem = await ThreadItem.create({
        body,
        user,
        thread,
    }).save();

    if(!threadItem){
        return{
            messages: ["Failed to create ThreadItem."],
        };
    }

    return{
        messages: ["ThreadItem created successfully."],
    };
};

export const getThreadItemsByThreadId = async(
    threadId: string
) : Promise<QueryArrayResult<ThreadItem>> => {
    const threadItems = await ThreadItem.createQueryBuilder("ti")
    .where(`ti."threadId" = :threadId`, {threadId})
    .leftJoinAndSelect("ti.thread", "thread")
    .orderBy("ti.CreatedOn", "DESC")
    .getMany();

    if(!threadItems){
        return {
            messages:["ThreadItems of thread not found."],
        };
    }

    console.log(threadItems);

    return{
        entities: threadItems,
    };
};