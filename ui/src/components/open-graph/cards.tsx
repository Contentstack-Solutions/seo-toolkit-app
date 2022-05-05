

const Card: React.FC<any> = function (props) {

    return (
            <div data-v-50ec5123="" className="px-4 py-6 text-left transition-all duration-200 ease-in-out bg-white border border-gray-100 border-solid rounded-lg shadow-sm dark:border-gray-500 dark:bg-gray-700 hover:shadow-md sm:px-6 sm:py-8 metatags-form">
                <p data-v-50ec5123="" className="max-w-2xl mb-4 text-base leading-5 text-gray-700 dark:text-gray-200">
                    How your website is displayed on search engines &amp; social media.
                </p>
                <div data-v-7f154148="" className="flex flex-col space-y-4 md:space-x-6 md:space-y-0 md:flex-row" data-v-50ec5123="">
                    <div data-v-7f154148="" className="relative flex flex-wrap w-full pb-8 -m-2">
                        <div data-v-7f154148="" className="w-full m-2">
                            <h3 data-v-7f154148="" className="mb-2 font-heading font-medium text-gray-900 uppercase dark:text-gray-200">
                                Facebook
                            </h3>
                            <div data-v-7f154148="" className="card card--twitter">
                                <div className="bg-center bg-no-repeat bg-cover card__image" style={{ backgroundImage: "url(" + props.data.global_field.image.url + ")" }} ></div>
                                <div className="antialiased break-words card__meta">
                                    <div className="overflow-hidden uppercase truncate whitespace-no-wrap card__website">
                                        {props.data.global_field.url.href }
                                    </div>
                                    <div className="overflow-hidden select-none card__title-wrapper">
                                        <div className="card__title truncate">
                                            {props.data.global_field.meta_title}
                                        </div>
                                        <div className="overflow-hidden break-words truncate whitespace-no-wrap select-none card__description">
                                            {props.data.global_field.meta_description }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div data-v-7f154148="" className="w-full m-2">
                            <h3 data-v-7f154148="" className="mb-2 font-heading font-medium text-gray-900 uppercase dark:text-gray-200">
                                Twitter
                            </h3>
                            <div data-v-7f154148="" className="card card--twitter">
                                <div className="bg-center bg-no-repeat bg-cover card__image" style={{ backgroundImage: "url(" + props.data.global_field.image.url + ")" }}></div>
                                <div className="antialiased break-words card__meta">
                                    <div className="overflow-hidden select-none card__title-wrapper">
                                        <div className="card__title truncate">
                                            {props.data.global_field.meta_title ? props.data.global_field.meta_title : ""}
                                        </div>
                                        <div className="overflow-hidden break-words truncate whitespace-no-wrap select-none card__description">
                                            {props.data.global_field.meta_description ? props.data.global_field.meta_description : ""}
                                        </div>
                                    </div>
                                    <div className="overflow-hidden uppercase truncate whitespace-no-wrap card__website">
                                        {props.data.global_field.url.href ? props.data.global_field.url.href : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div data-v-7f154148="" className="w-full m-2">
                            <h3 data-v-7f154148="" className="mb-2 font-heading font-medium text-gray-900 uppercase dark:text-gray-200">
                                LinkedIn
                            </h3>
                            <div data-v-7f154148="" className="card card--twitter">
                                <div className="bg-center bg-no-repeat bg-cover card__image" style={{ backgroundImage: "url(" + props.data.global_field.image.url + ")" }}></div>
                                <div className="antialiased break-words card__meta">
                                    <div className="overflow-hidden select-none card__title-wrapper">
                                        <div className="card__title">
                                            {props.data.global_field.meta_title ? props.data.global_field.meta_title : ""}
                                        </div>
                                    </div>
                                    <div className="overflow-hidden uppercase truncate whitespace-no-wrap card__website">
                                        {props.data.global_field.url.href ? props.data.global_field.url.href : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div data-v-7f154148="" className="w-full m-2">
                            <h3 data-v-7f154148="" className="mb-2 font-heading font-medium text-gray-900 uppercase dark:text-gray-200">
                                Discord
                            </h3>
                            <div data-v-7f154148="" className="card card--discord">
                                <div className="discord-grid">
                                    <div className="card__website">{props.data.global_field.url.meta_title}</div>
                                    <div className="card__title">{props.data.global_field.meta_title}</div>
                                    <div className="card__description"><span>{props.data.global_field.meta_description}.</span></div>
                                    <div className="card__image">
                                        <a href={props.data.global_field.url.href} target="_blank" title={props.data.global_field.url.meta_title} rel="noopener noreferrer">
                                            <img src={props.data.global_field.image.url} width="400" alt={props.data.global_field.meta_description} loading="lazy" decoding="async" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Card;