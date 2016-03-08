//
//  EHMMatchTableViewCell.h
//  eHireMe-iOS
//
//  Created by Mac Liu on 3/8/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface EHMMatchTableViewCell : UITableViewCell
@property (strong, nonatomic) IBOutlet UIImageView *profilePicture;
@property (strong, nonatomic) IBOutlet UILabel *jobTitleLabel;
@property (strong, nonatomic) IBOutlet UILabel *employerLabel;

@end
