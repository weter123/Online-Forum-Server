import { BaseEntity, Column } from "typeorm";

export class Auditable extends BaseEntity{
    @Column("varchar",{
        name:"CreatedBy",
        length: 60,
        default: () =>`getpgusername()`,
        nullable: false
    })
    createdBy: string;

    @Column("timestamp with time zone",{
        name: "CreatedOn",
        default: () => `now()`,
        nullable:false
    })
    createdOnd: Date;

    @Column("varchar",{
        name:"LastModifiedBy",
        length: 60,
        default: () =>`getpgusername()`,
        nullable: false
    })
    lastModifiedOn: string;

    @Column("timestamp with time zone",{
        name: "LastModifiedOn",
        default: () => `now()`,
        nullable:false
    })
    LastModifiedOn: Date;

}