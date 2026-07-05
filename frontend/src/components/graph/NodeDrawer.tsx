import {
    Drawer,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

interface Props {

    open: boolean;

    onClose: () => void;

    data: any;

}

export default function NodeDrawer({

    open,

    onClose,

    data,

}: Props) {

    return (

        <Drawer

            anchor="right"

            open={open}

            onClose={onClose}

        >

            <div
                style={{
                    width: 350,
                    padding: 20,
                }}
            >

                <Typography
                    variant="h5"
                >

                    {data?.concept}

                </Typography>

                <Divider
                    sx={{ my:2 }}
                />

                <List>

                    {

                        data?.occurrences?.map(

                            (
                                item:any,
                                index:number
                            )=>(

                                <ListItem
                                    key={index}
                                >

                                    <ListItemText

                                        primary={
                                            item.document
                                        }

                                        secondary={

                                            `Page ${item.page}
                                             •
                                             ${item.section}`

                                        }

                                    />

                                </ListItem>

                            )

                        )

                    }

                </List>

            </div>

        </Drawer>

    );

}