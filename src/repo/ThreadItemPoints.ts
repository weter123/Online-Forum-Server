import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ThreadItem } from "./ThreadItem";
import { User } from "./User";


@Entity({name: "ThreadItemPoints"})
export class ThreadItemPoint {

    @PrimaryGeneratedColumn({name:"Id", type:"bigint"})
    id:string;

    
    @Column("boolean",{
        name: "IsDecrement",
        default: false,
        nullable: false
    })
    isDecrement: boolean;

    @ManyToOne(()=> User, (user) => user.threadPoints)
    user: User;

    @ManyToOne(()=> ThreadItem, (threadItem) => threadItem.threadItemPoints)
    threadItem: ThreadItem;

}